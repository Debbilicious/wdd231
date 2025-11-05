// output.mjs

// Exported as a named export
export function setTitle(course) {
  document.querySelector("h2").textContent = course.courseName;
}

// Exported as a named export
export function renderSections(sections) {
  const html = sections.map(
    (section) => `<tr>
        <td>${section.sectionNum}</td>
        <td>${section.roomNum}</td>
        <td>${section.enrolled}</td>
        <td>${section.days}</td>
        <td>${section.instructor}</td>
    </tr>`
  );
  document.querySelector("#sections").innerHTML = html.join("");
}