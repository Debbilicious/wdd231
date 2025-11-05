// course.mjs

const byuiCourse = {
  courseName: "WDD 231",
  sections: [
    {
      sectionNum: 1,
      roomNum: "CCB 111",
      enrolled: 26,
      days: "TTh",
      instructor: "Bro. T",
    },
    {
      sectionNum: 2,
      roomNum: "CCB 122",
      enrolled: 29,
      days: "TTh",
      instructor: "Sis. A",
    },
    {
      sectionNum: 3,
      roomNum: "CCB 133",
      enrolled: 18,
      days: "MWF",
      instructor: "Bro. R",
    },
  ],

  // Method to change enrollment
  changeEnrollment: function (sectionNum, add = true) {
    const sectionIndex = this.sections.findIndex(
      (sec) => sec.sectionNum == sectionNum
    );
    if (sectionIndex >= 0) {
      if (add) {
        this.sections[sectionIndex].enrolled++;
      } else {
        this.sections[sectionIndex].enrolled--;
      }
      // REMOVED: renderSections(this.sections); // This line must be removed
      // as instructed, because renderSections is now in output.mjs
    }
  },
};

// Export the course object as the default export
export default byuiCourse;