// Get the current year and display it in the footer
const currentYear = new Date().getFullYear();
document.getElementById('currentYear').textContent = currentYear;

// Get the last modified date of the document and display it
const lastModifiedElement = document.getElementById('lastModified');
if (lastModifiedElement) {
  lastModifiedElement.textContent = `Last Modification: ${document.lastModified}`;
}