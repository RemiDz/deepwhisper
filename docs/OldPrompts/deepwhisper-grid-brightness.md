# DeepWhisper — Learn Tab Kin Grid Brightness Fix

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish. Use `--yes` flag where relevant.

## Thinking Level: ultrathink

## One Issue

The 260 Kin grid in step 5 of the Learn tab is too dimmed — the castle colour cells are barely visible.

## Fix

Find the Kin grid cells in the Learn tab (step 5, "260 Kin grid") and increase their opacity:

- Change cell opacity from whatever it currently is (likely 0.3-0.4) to **0.7**
- Cell border opacity can stay subtle (0.1-0.15)
- On hover/tap, the active cell should go to **1.0** opacity

This makes the five castle colour bands clearly visible and vibrant while still maintaining the dark aesthetic.

## DO NOT

- Do NOT modify anything outside the Learn tab step 5
- Do NOT change the grid layout or colours — just the opacity

## Quality Check

- [ ] All 260 cells clearly visible with vibrant castle colours
- [ ] Five vertical colour bands (red, white, blue, yellow, green) are distinct
- [ ] `git push origin master:main` succeeds
