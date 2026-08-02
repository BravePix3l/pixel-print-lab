import yazl from "yazl";

const buildModel3mf = (size) => `<?xml version="1.0" encoding="UTF-8"?>
<model unit="millimeter" xml:lang="en-US" xmlns="http://schemas.microsoft.com/3dmanufacturing/core/2015/02">
  <resources>
    <object id="1" type="model">
      <mesh>
        <vertices>
          <vertex x="0" y="0" z="0"/>
          <vertex x="${size}" y="0" z="0"/>
          <vertex x="${size}" y="${size}" z="0"/>
          <vertex x="0" y="${size}" z="0"/>
          <vertex x="0" y="0" z="${size}"/>
          <vertex x="${size}" y="0" z="${size}"/>
          <vertex x="${size}" y="${size}" z="${size}"/>
          <vertex x="0" y="${size}" z="${size}"/>
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
</model>`;

export function create3mfCubeBuffer(size = 10) {
  const zip = new yazl.ZipFile();
  const modelXml = buildModel3mf(size);
  zip.addBuffer(Buffer.from(`<?xml version="1.0" encoding="UTF-8"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="model" ContentType="application/vnd.ms-package.3dmanufacturing-3dmodel+xml"/>
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
</Types>`, "utf8"), "[Content_Types].xml");
  zip.addBuffer(Buffer.from(`<?xml version="1.0" encoding="UTF-8"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rel0" Target="/3D/3dmodel.model" Type="http://schemas.microsoft.com/3dmanufacturing/2013/01/3dmodel"/>
</Relationships>`, "utf8"), "_rels/.rels");
  zip.addBuffer(Buffer.from(modelXml, "utf8"), "3D/3dmodel.model");
  zip.end();
  return new Promise((resolve, reject) => {
    const chunks = [];
    zip.outputStream.on("data", (chunk) => chunks.push(chunk));
    zip.outputStream.on("end", () => resolve(Buffer.concat(chunks)));
    zip.outputStream.on("error", reject);
  });
}

export function createInvalid3mfBuffer() {
  return Buffer.from("questo non e un modello 3MF valido", "utf8");
}
