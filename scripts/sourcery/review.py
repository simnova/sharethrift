import argparse
import shlex
import subprocess
import sys
from pathlib import Path


REPO_ROOT = Path(__file__).resolve().parent.parent.parent
DEFAULT_BASE_BRANCH = "origin/main"


def check_sourcery_installed() -> bool:
    """Verify Sourcery is installed and accessible."""
    try:
        result = subprocess.run(
            ["sourcery", "--version"],
            capture_output=True,
            text=True,
        )
        return result.returncode == 0
    except FileNotFoundError:
        return False


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Run Sourcery code review",
        epilog="Sourcery configuration: .sourcery.yaml",
    )
    parser.add_argument(
        "--fix",
        action="store_true",
        help="Automatically apply Sourcery suggestions",
    )
    parser.add_argument(
        "--check",
        action="store_true",
        help="Return exit code 1 if unsolved issues found (for CI/verify)",
    )
    parser.add_argument(
        "--diff",
        action="store_true",
        help="Review only changed lines (vs origin/main)",
    )
    parser.add_argument(
        "--base",
        default=DEFAULT_BASE_BRANCH,
        help=f"Base branch for diff (default: {DEFAULT_BASE_BRANCH})",
    )
    args = parser.parse_args()

    # Check if Sourcery is installed
    if not check_sourcery_installed():
        print(
            "✘ Sourcery is not installed or not in PATH.\n"
            "   Install it with: pnpm run install:all"
        )
        sys.exit(1)

    # Build Sourcery command
    cmd = ["sourcery", "review"]

    if args.fix:
        cmd.append("--fix")

    if args.check:
        cmd.append("--check")

    if args.diff:
        # Use Sourcery's native --diff flag to review only changed lines
        cmd.extend(["--diff", shlex.quote(f"git diff {args.base}")])

    # Review from repo root
    cmd.append(".")

    # Run Sourcery
    try:
        proc = subprocess.run(cmd, cwd=REPO_ROOT)
        sys.exit(proc.returncode)
    except FileNotFoundError:
        print("✘ Sourcery command not found. Ensure it's installed and in PATH.")
        sys.exit(1)


if __name__ == "__main__":
    main()
