// VIDEO-ONLY content. Not on the website yet. The owner will move it into src/content.js later.
// Everything else in the video comes from ../../src/content.js (copied to src/generated/ by `npm run sync`).
// OWNER: confirm the three lines marked CONFIRM.
export const videoContent = {
  satya: {
    // Date line is NOT typed here: it comes from content.event.dateLong. CONFIRM: Satyanarayan Puja is on the SAME day.
    titleA: 'Satyanarayan',        // CONFIRM spelling
    titleB: 'Puja',
    time: '6:00',
    meridiem: 'PM',
    timeNote: 'onwards',
    arriveLead: 'Kindly arrive before',
    arriveTime: '5:30 PM',
    clock: { hour: 5, minute: 30 }, // the clock icon shows this time
  },
  dateScene: {
    timeLabel: 'Birthday Puja',     // CONFIRM. Small label above "7:00 PM" so nobody mixes it up with the 6:00 PM puja. '' = hide.
  },
  siteUrl: '', // '' = not shown
};
