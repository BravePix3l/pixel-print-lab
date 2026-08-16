export function createColorOption(color, groupName, selected, { required = true, onChange } = {}) {
  const label = document.createElement("label");
  const input = document.createElement("input");
  const swatch = document.createElement("span");

  label.className = "color-option";
  label.title = color.name;
  input.type = "radio";
  input.name = groupName;
  input.value = color.id;
  input.checked = selected;
  input.defaultChecked = selected;
  if (required) input.required = true;
  input.setAttribute("aria-label", color.name);
  swatch.className = "color-option__swatch";
  swatch.style.backgroundColor = color.hexValue;

  if (onChange) {
    input.addEventListener("change", () => onChange(color));
  }

  label.append(input, swatch);
  return label;
}
