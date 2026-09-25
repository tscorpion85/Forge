# Small Worlds

The first experiment in Forge: a tiny landscape you can shape and watch evolve.

Play at [tscorpion85.github.io/Forge](https://tscorpion85.github.io/Forge/) or open `index.html` in a modern browser. Paint grass, trees, water, stone, fire, or bare soil. Different patches of soil support forests, grassland, and open ground; burned areas gradually reseed; water encourages growth; fire spreads through vegetation and follows the wind; rain dampens it. A year cycles through spring growth, dry summers with rare lightning, autumn, and winter dormancy. Pause time, choose a wind direction, change its speed, generate another landscape, save a PNG snapshot, or export and import a world file. Pointer controls work with a mouse, pen, or touch screen.

There are no dependencies, accounts, tracking scripts, network requests, or build steps. The world saves automatically in browser storage when available. Use **Save world** to download a portable JSON copy and **Load world** to reopen it, especially when using a downloaded HTML file on Android; browser storage may not persist for local files. Each new world starts with a random landscape.

Forge is an open-ended collection of playable experiments. This is experiment 001.

Run `node tests/ecology.test.cjs` to check saved-world compatibility and the long-term habitat simulation.
