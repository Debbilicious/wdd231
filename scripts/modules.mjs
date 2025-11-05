// modules.mjs

// 1. Import the course object (default export)
import byuiCourse from "./course.mjs";

// 2. Import the setSectionSelection function (named export)
import { setSectionSelection } from "./sections.mjs";

// 3. Import the setTitle and renderSections functions (named exports)
import { setTitle, renderSections } from "./output.mjs";

// Initial setup and rendering
setTitle(byuiCourse);
setSectionSelection(byuiCourse.sections);
renderSections(byuiCourse.sections);

// Event Listener for Enroll Button
document
  .querySelector("#enrollStudent")
  .addEventListener("click", function () {
    const sectionNum = document.querySelector("#sectionNumber").value;
    // Update the course data
    byuiCourse.changeEnrollment(sectionNum);
    // 4. Update the output after enrollment changes
    renderSections(byuiCourse.sections);
  });

// Event Listener for Drop Button
document.querySelector("#dropStudent").addEventListener("click", function () {
  const sectionNum = document.querySelector("#sectionNumber").value;
  // Update the course data
  byuiCourse.changeEnrollment(sectionNum, false); // false for dropping
  // 4. Update the output after enrollment changes
  renderSections(byuiCourse.sections);
});