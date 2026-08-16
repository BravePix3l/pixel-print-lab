import { defaultCatalogDirectory, inspectCatalogModel } from "./catalog-assets.js";

async function serializeProduct(product, catalogDirectory = defaultCatalogDirectory) {
  const inspection = await inspectCatalogModel(product.model_url, catalogDirectory);
  return {
    id: product.id,
    code: product.code,
    name: product.name,
    description: product.description,
    priceCents: product.price_cents,
    imageUrl: product.image_url,
    material: product.material,
    modelUrl: product.model_url,
    inspection,
  };
}

export function registerCatalogRoutes(app, database, catalogDirectory = defaultCatalogDirectory) {
  const listProducts = database.prepare(`
    SELECT * FROM products
    WHERE visible = 1
    ORDER BY id
  `);
  const findVisibleProduct = database.prepare(`
    SELECT * FROM products
    WHERE id = ? AND visible = 1
  `);
  const listColors = database.prepare(`
    SELECT id, name, hex_value
    FROM colors
    WHERE active = 1
    ORDER BY sort_order, id
  `);

  app.get("/api/products", async (_request, response) => {
    const products = await Promise.all(listProducts.all().map((product) => serializeProduct(product, catalogDirectory)));
    response.json({ data: products, count: products.length });
  });

  app.get("/api/products/:id", async (request, response) => {
    if (!/^\d+$/.test(request.params.id)) {
      return response.status(400).json({
        error: { code: "INVALID_PRODUCT_ID", message: "L'identificativo prodotto deve essere numerico." },
      });
    }

    const product = findVisibleProduct.get(Number.parseInt(request.params.id, 10));
    if (!product) {
      return response.status(404).json({
        error: { code: "PRODUCT_NOT_FOUND", message: "Prodotto non trovato." },
      });
    }

    return response.json({ data: await serializeProduct(product, catalogDirectory) });
  });

  app.get("/api/colors", (_request, response) => {
    const colors = listColors.all().map((color) => ({
      id: color.id,
      name: color.name,
      hexValue: color.hex_value,
    }));
    response.json({ data: colors, count: colors.length });
  });
}
