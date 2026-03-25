import argparse
import re
import shlex
import subprocess
import sys
from pathlib import Path


REPO_ROOT = Path(__file__).resolve().parent.parent.parent
DEFAULT_BASE_BRANCH = "origin/main"

# Global tags — applied to the entire repo
GLOBAL_TAGS = ["default", "ts-conventions"]

# Scoped rules — applied to specific package directories
# Each entry maps a tag to the directory it should be applied to.
SCOPED_TAGS: list[tuple[str, str]] = [
    ("ddd-domain", "packages/sthrift/domain"),
    ("ddd-graphql", "packages/sthrift/graphql"),
    ("ddd-persistence", "packages/sthrift/persistence"),
    ("react-conventions", "apps/ui-sharethrift"),
]

# Friendly labels for each tag (used in terminal output)
TAG_LABELS: dict[str, str] = {
    "ddd-domain": "DDD boundaries (domain)",
    "ddd-graphql": "DDD boundaries (graphql)",
    "ddd-persistence": "DDD boundaries (persistence)",
    "react-conventions": "React conventions",
}


def validate_git_ref(ref: str) -> str:
    """Validate git reference to prevent command injection."""
    if not re.match(r'^[a-zA-Z0-9/_.-]+$', ref):
        raise ValueError(f"Invalid git reference: {ref}")
    return ref


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


def build_base_cmd(args: argparse.Namespace) -> list[str]:
    """Build the common Sourcery command prefix."""
    cmd: list[str] = ["sourcery", "review"]

    if args.fix:
        cmd.append("--fix")
    if args.check:
        cmd.append("--check")
    if args.diff:
        try:
            safe_base = validate_git_ref(args.base)
            # Use shlex.quote as additional safety layer for subprocess argument
            quoted_base = shlex.quote(safe_base)
            cmd.extend(["--diff", f"git diff {quoted_base}"])
        except ValueError as e:
            print(f"✘ {e}")
            sys.exit(1)

    return cmd


def run_sourcery(cmd: list[str], label: str) -> int:
    """Run a Sourcery command, print its label, return the exit code.

    Uses list-based subprocess.run() which is safe from shell injection.
    All user input is validated via validate_git_ref() before being included.
    """
    print(f"\n{'─' * 60}")
    print(f"  {label}")
    print(f"{'─' * 60}\n")
    try:
        # nosec B603: Safe - uses list args (no shell=True), user input validated via validate_git_ref()
        # and escaped via shlex.quote(). List-based subprocess.run() is the recommended safe pattern.
        proc = subprocess.run(cmd, cwd=REPO_ROOT)
        return proc.returncode
    except FileNotFoundError:
        print("✘ Sourcery command not found.")
        return 1


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Run Sourcery code review",
        epilog="Sourcery configuration: .sourcery.yaml + .sourcery/rules/",
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

    if not check_sourcery_installed():
        print(
            "✘ Sourcery is not installed or not in PATH.\n"
            "   Install it with: pnpm run install:all"
        )
        sys.exit(1)

    worst_exit = 0

    # 1. Global rules (safe to run on entire repo, no false positives)
    cmd = build_base_cmd(args)
    for tag in GLOBAL_TAGS:
        cmd.extend(["--enable", tag])
    cmd.append(".")
    global_tags_str = ", ".join(GLOBAL_TAGS)
    rc = run_sourcery(cmd, f"Global rules ({global_tags_str})")
    worst_exit = max(worst_exit, rc)

    # 2. Scoped rules (must be scoped to specific directories)
    # Group by directory to reduce command invocations
    dirs_with_tags: dict[str, list[str]] = {}
    for tag, directory in SCOPED_TAGS:
        if directory not in dirs_with_tags:
            dirs_with_tags[directory] = []
        dirs_with_tags[directory].append(tag)

    for directory, tags in dirs_with_tags.items():
        target = REPO_ROOT / directory
        if not target.is_dir():
            print(f"⚠ Skipping {directory}: not found")
            continue
        cmd = build_base_cmd(args)
        for tag in tags:
            cmd.extend(["--enable", tag])
        cmd.append(directory)
        tag_names = ", ".join(TAG_LABELS.get(t, t) for t in tags)
        rc = run_sourcery(cmd, f"{tag_names} → {directory}/")
        worst_exit = max(worst_exit, rc)

    sys.exit(worst_exit)


if __name__ == "__main__":
    main()
