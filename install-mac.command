#!/bin/bash
# Evidence & Air — installer for macOS and Linux.
# Double-click this file, or run:  bash install-mac.command

set -u
SRC="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILLS="$HOME/.claude/skills"
DEST="$SKILLS/evidence-and-air"

echo
echo "  ============================================"
echo "    Evidence & Air  -  installing"
echo "  ============================================"
echo

if [ ! -f "$SRC/SKILL.md" ]; then
  echo "  [X] SKILL.md was not found next to this file."
  echo
  echo "  This usually means the installer is still inside the ZIP."
  echo "  Extract the ZIP to a real folder first, then run this again."
  echo
  read -n 1 -s -r -p "  Press any key to close."
  echo
  exit 1
fi

if [ ! -d "$HOME/.claude" ]; then
  echo "  [!] The .claude folder does not exist yet."
  echo "      That folder is created the first time Claude runs."
  echo
  echo "      Open Claude once, close it, then run this installer again."
  echo
  read -n 1 -s -r -p "  Press any key to close."
  echo
  exit 1
fi

mkdir -p "$DEST"
echo "  Copying to:"
echo "  $DEST"
echo

# copy everything except the installers themselves
( cd "$SRC" && tar -cf - \
    --exclude=install-mac.command --exclude=install-windows.bat \
    --exclude=.gitignore --exclude=./docs . ) \
  | ( cd "$DEST" && tar -xf - )

if [ ! -f "$DEST/SKILL.md" ]; then
  echo "  [X] Something went wrong - SKILL.md is not in place."
  echo
  read -n 1 -s -r -p "  Press any key to close."
  echo
  exit 1
fi

echo "  ============================================"
echo "    Done."
echo "  ============================================"
echo
echo "  One last step, and it matters:"
echo "  QUIT Claude completely and open it again."
echo "  Minimising is not enough - skills load only at startup."
echo
echo "  Then just ask it to build you a presentation."
echo
read -n 1 -s -r -p "  Press any key to close."
echo
