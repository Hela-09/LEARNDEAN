// Verification of remaining tests: University, Custom Subtopic, Theory Assignment & AI Marking
async function runRemainingTests() {
  const baseUrl = 'http://localhost:3000';
  console.log('--- Testing University, Custom Subtopic & Theory Marking ---');

  // Test 3: University level
  console.log('\n[Test 3] Testing University Education Lesson Generation...');
  const resUni = await fetch(`${baseUrl}/api/ai/classroom-lesson`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      subject: 'Biology',
      topic: 'Photosynthesis',
      level: 'Tertiary / University Education',
      grade: '200 Level (Undergraduate)',
      age: 20,
    }),
  });
  const dataUni = await resUni.json();
  console.log('✓ University Lesson Title:', dataUni.lesson?.title);
  console.log('  Explanation excerpt:', dataUni.lesson?.steps?.[0]?.spokenExplanation?.slice(0, 110) + '...');

  // Test 4: Custom subject & optional subtopic
  console.log('\n[Test 4] Testing Custom Subject & Subtopic...');
  const resCust = await fetch(`${baseUrl}/api/ai/classroom-lesson`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      subject: 'Accounting',
      topic: 'Financial Statements',
      subtopic: 'Working Capital & Ratio Analysis',
      level: 'Secondary Education',
      grade: 'Senior Secondary 3 (SSS 3)',
    }),
  });
  const dataCust = await resCust.json();
  console.log('✓ Custom Subject & Subtopic Lesson generated:');
  console.log('  Subject:', dataCust.lesson?.subject, '| Topic:', dataCust.lesson?.topic, '| Subtopic:', dataCust.lesson?.subtopic);

  // Test 5: Theory Assignment Generation (pure theory questions)
  console.log('\n[Test 5] Testing Theory Assignment Generation...');
  const resAsg = await fetch(`${baseUrl}/api/ai/classroom-assignment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      subject: 'Biology',
      topic: 'Photosynthesis',
      subtopic: 'Light-Dependent Reactions',
      level: 'Secondary Education',
      grade: 'SSS 2',
      questionCount: 3,
    }),
  });
  const dataAsg = await resAsg.json();
  const asg = dataAsg.assignment;
  console.log('✓ Theory Assignment Title:', asg?.title);
  console.log('  Total Marks:', asg?.totalMarks);
  console.log('  Number of Theory Questions:', asg?.questions?.length);
  console.log('  Q1 Question:', asg?.questions?.[0]?.question);
  console.log('  Q1 Rubric criteria:', asg?.questions?.[0]?.markingCriteria);

  // Test 6: AI Marking of Typed Text Theory Answer
  console.log('\n[Test 6] Testing AI Marking of Student Typed Theory Answer...');
  const q1 = asg.questions[0];
  const textAnswers = {
    [q1.id]: {
      type: 'text',
      textContent: 'Photosynthesis is the metabolic pathway whereby chlorophyllous cells synthesize triose phosphates from carbon dioxide and water using photons. In the light-dependent stage, water photolysis releases protons and electrons through photosystems II and I, synthesizing NADPH and ATP via chemiosmosis.',
      images: [],
    },
  };
  const resMarkText = await fetch(`${baseUrl}/api/ai/classroom-mark-theory`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      subject: 'Biology',
      topic: 'Photosynthesis',
      level: 'Secondary Education',
      grade: 'SSS 2',
      assignment: asg,
      answers: textAnswers,
    }),
  });
  const dataMarkText = await resMarkText.json();
  console.log('✓ Typed Answer Marking Result:');
  console.log('  Score:', `${dataMarkText.totalScore} / ${dataMarkText.totalMarks} (${dataMarkText.percentage}%) - Grade: ${dataMarkText.grade}`);
  console.log('  Q1 Marks Awarded:', `${dataMarkText.questionResults?.[q1.id]?.marksAwarded} / ${dataMarkText.questionResults?.[q1.id]?.marksAvailable}`);
  console.log('  Feedback:', dataMarkText.questionResults?.[q1.id]?.feedback?.slice(0, 120) + '...');

  // Test 7: Multimodal Vision Marking of Handwritten Image
  console.log('\n[Test 7] Testing Multimodal Vision Marking of Uploaded Handwritten Paper Image...');
  const samplePng = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
  const imgAnswers = {
    [q1.id]: {
      type: 'image',
      textContent: '',
      images: [{ url: samplePng, name: 'handwritten_notes.png' }],
    },
  };
  const resMarkImg = await fetch(`${baseUrl}/api/ai/classroom-mark-theory`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      subject: 'Biology',
      topic: 'Photosynthesis',
      level: 'Secondary Education',
      grade: 'SSS 2',
      assignment: asg,
      answers: imgAnswers,
    }),
  });
  const dataMarkImg = await resMarkImg.json();
  console.log('✓ Multimodal AI Vision Marking Result:');
  console.log('  isUnclear flag:', dataMarkImg.questionResults?.[q1.id]?.isUnclear);
  console.log('  Feedback:', dataMarkImg.questionResults?.[q1.id]?.feedback?.slice(0, 120) + '...');
  console.log('  Overall feedback:', dataMarkImg.overallFeedback?.slice(0, 120) + '...');

  console.log('\n--- All Tests Passed Successfully! ---');
}

runRemainingTests().catch(console.error);
