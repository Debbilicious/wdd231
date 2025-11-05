// sections.mjs

// Exported as a named export: setSectionSelection
export function setSectionSelection(sections) {
  const selectElement = document.querySelector("#sectionNumber");
  selectElement.innerHTML = ""; // Clear existing options

  sections.forEach((section) => {
    const option = document.createElement("option");
    option.value = section.sectionNum;
    option.textContent = `Section ${section.sectionNum}: ${section.days} (${section.instructor})`;
    selectElement.appendChild(option);
  });
}