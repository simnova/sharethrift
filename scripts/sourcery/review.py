import argparse
import subprocess
import sys
from pathlib import Path


REPO_ROOT = Path(__file__).resolve().parent.parent.parent
DEFAULT_BASE_BRANCH = "origin/main"

# Global tags — applied to the entire repo
GLOBAL_TAGS = ["default", "security"]

# DDD boundary tags — scoped to specific package directories
# Each entry maps a tag to the directory it should be applied to.
DDD_SCOPED_TAGS: list[tuple[str, str]] = [
    ("ddd-domain", "packages/sthrift/domain"),
    ("ddd-graphql", "packages/sthrift/graphql"),
    ("ddd-persistence", "packages/sthrift/persistence"),
    ("ddd-seedwork", "packages/cellix/domain-seedwork"),
    ("ts-conventions", "packages/sthrift/domain/src"),
    ("react-perf", "apps/ui-sharethrift"),
    ("react-perf", "packages/sthrift/ui-components"),
]

# Friendly labels for each tag (used in terminal output)
TAG_LABELS: dict[str, str] = {
    "ddd-domain": "DDD boundaries (domain)",
    "ddd-graphql": "DDD boundaries (graphql)",
    "ddd-persistence": "DDD boundaries (persistence)",
    "ddd-seedwork": "DDD boundaries (seedwork)",
    "ts-conventions": "TypeScript conventions",
    "react-perf": "React performance",
}


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
        cmd.extend(["--diff", f"git diff {args.base}"])

    return cmd


def run_sourcery(cmd: list[str], label: str) -> int:
    """Run a Sourcery command, print its label, return the exit code."""
    print(f"\n{'─' * 60}")
    print(f"  {label}")
    print(f"{'─' * 60}\n")
    try:
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

    # 1. Global rules (default + security) on the whole repo
    cmd = build_base_cmd(args)
    for tag in GLOBAL_TAGS:
        cmd.extend(["--enable", tag])
    cmd.append(".")
    rc = run_sourcery(cmd, "Global rules (default + security)")
    worst_exit = max(worst_exit, rc)

    # 2. Scoped rules — applied to their respective directories
    for tag, directory in DDD_SCOPED_TAGS:
        target = REPO_ROOT / directory
        if not target.is_dir():
            print(f"⚠ Skipping {tag}: {directory} not found")
            continue
        cmd = build_base_cmd(args)
        cmd.extend(["--enable", tag])
        cmd.append(directory)
        label = TAG_LABELS.get(tag, tag)
        rc = run_sourcery(cmd, f"{label} → {directory}/")
        worst_exit = max(worst_exit, rc)

    sys.exit(worst_exit)


if __name__ == "__main__":
    main()
