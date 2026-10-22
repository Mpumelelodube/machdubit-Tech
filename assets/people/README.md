# Office character assets

Classic animated low-poly characters by [Quaternius](https://quaternius.com/),
distributed by the creator under [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/).
These are generic illustrative office occupants.

| Local file | Creator's model listing | Final bytes | Triangles |
| --- | --- | ---: | ---: |
| `man-suit.glb` | https://poly.pizza/m/mQnGoME1ez | 290,956 | 2,058 |
| `man-casual.glb` | https://poly.pizza/m/DLptRuewTn | 256,796 | 1,970 |
| `woman-cardigan.glb` | https://poly.pizza/m/jpKRgGDxhk | 325,700 | 2,776 |
| `woman-casual.glb` | https://poly.pizza/m/AQsd9ngvKU | 249,592 | 2,004 |

The files retain the complete original geometry, materials, rig and skin weights.
Unused animation clips and their now-unreferenced binary data were removed.
`Idle` at original time 0 and `Sitting` at original time 4.167 seconds were baked
into constant one-second poses, each using two identical keys. This keeps normal
animation playback safe while avoiding unused keyframes. Only `man-casual.glb`
retains the full original `Walk` animation, because it is the walking occupant.
There are no external textures or geometry dependencies.
Total uncompressed asset payload: 1,123,044 bytes. A local Brotli compression
trial produces 195,370 bytes in total; actual delivery compression depends on hosting.

Processing used local GLB pose-baking and pruning scripts with Three.js 0.186.1.
Verification loaded original and final files with the same GLTFLoader and compared
every deformed mesh vertex at five times in each retained clip: 45 pose samples.
The maximum difference was 0.000000217 native model units, from float32 quaternion
sampling during pose baking; the mesh, weights and materials remain unchanged.

The native forward axis is +Z. The source `Sitting` animation begins standing;
the baked office clip is seated at every time. Character scale, placement and
desk poses are set by the office scene.
