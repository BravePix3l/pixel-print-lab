import assert from "node:assert/strict";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, it } from "node:test";
import yazl from "yazl";
import { convert3mfFileToStl, measureStlFile } from "../src/model-files.js";

function build3mfBuffer() {
  const zip = new yazl.ZipFile();
  const add = (name, content) => zip.addBuffer(Buffer.from(content, "utf8"), name);

  add("[Content_Types].xml", `<?xml version="1.0" encoding="UTF-8"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="model" ContentType="application/vnd.ms-package.3dmanufacturing-3dmodel+xml"/>
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
</Types>`);

  add("_rels/.rels", `<?xml version="1.0" encoding="UTF-8"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rel0" Target="/3D/3dmodel.model" Type="http://schemas.microsoft.com/3dmanufacturing/2013/01/3dmodel"/>
</Relationships>`);

  add("3D/3dmodel.model", `<?xml version="1.0" encoding="UTF-8"?>
<model unit="millimeter" xml:lang="en-US" xmlns="http://schemas.microsoft.com/3dmanufacturing/core/2015/02">
  <resources>
    <object id="1" type="model">
      <mesh>
        <vertices>
          <vertex x="0" y="0" z="0"/>
          <vertex x="10" y="0" z="0"/>
          <vertex x="10" y="10" z="0"/>
          <vertex x="0" y="10" z="0"/>
          <vertex x="0" y="0" z="10"/>
          <vertex x="10" y="0" z="10"/>
          <vertex x="10" y="10" z="10"/>
          <vertex x="0" y="10" z="10"/>
        </vertices>
        <triangles>
          <triangle v1="0" v2="1" v3="2"/>
          <triangle v1="0" v2="2" v3="3"/>
          <triangle v1="5" v2="4" v3="7"/>
          <triangle v1="5" v2="7" v3="6"/>
          <triangle v1="1" v2="5" v3="6"/>
          <triangle v1="1" v2="6" v3="2"/>
          <triangle v1="4" v2="0" v3="3"/>
          <triangle v1="4" v2="3" v3="7"/>
          <triangle v1="3" v2="2" v3="6"/>
          <triangle v1="3" v2="6" v3="7"/>
          <triangle v1="4" v2="5" v3="1"/>
          <triangle v1="4" v2="1" v3="0"/>
        </triangles>
      </mesh>
    </object>
  </resources>
  <build>
    <item objectid="1"/>
  </build>
</model>`);

  zip.end();
  return new Promise((resolve, reject) => {
    const chunks = [];
    zip.outputStream.on("data", (chunk) => chunks.push(chunk));
    zip.outputStream.on("end", () => resolve(Buffer.concat(chunks)));
    zip.outputStream.on("error", reject);
  });
}

describe("convert3mfFileToStl", () => {
  it("converte un 3MF semplice in STL valido", async () => {
    const workDirectory = await mkdtemp(path.join(tmpdir(), "pixel-print-lab-3mf-"));
    try {
      const sourcePath = path.join(workDirectory, "cube.3mf");
      const targetPath = path.join(workDirectory, "cube.stl");
      await writeFile(sourcePath, await build3mfBuffer());

      await convert3mfFileToStl(sourcePath, targetPath);
      const stl = await measureStlFile(targetPath);

      assert.equal(stl.triangleCount, 12);
      assert.ok(Math.abs(stl.volumeMm3 - 1000) < 0.001, `volume atteso ~1000, ottenuto ${stl.volumeMm3}`);
      assert.deepEqual(stl.boundsMm.size, [10, 10, 10]);
    } finally {
      await rm(workDirectory, { recursive: true, force: true }).catch(() => {});
    }
  });
});
