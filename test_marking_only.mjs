// Test Theory Assignment Generation and AI Multimodal Marking
async function testTheoryAssignmentAndMarking() {
  const baseUrl = 'http://localhost:3000';
  console.log('--- Testing Theory Assignment Generation & Multimodal Marking ---');

  // Test 5: Theory Assignment Generation
  console.log('\n[Test 5] Calling /api/ai/classroom-assignment...');
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
  console.log('✓ Assignment Title:', asg?.title);
  console.log('  Questions Count:', asg?.questions?.length);
  console.log('  Q1 Question:', asg?.questions?.[0]?.question);
  console.log('  Q1 Marking Criteria:', asg?.questions?.[0]?.markingCriteria);

  // Test 6: AI Marking of Typed Answer
  console.log('\n[Test 6] Calling /api/ai/classroom-mark-theory with typed text...');
  const q1 = asg.questions[0];
  const textAnswers = {
    [q1.id]: {
      type: 'text',
      textContent: 'Photosynthesis is the process by which green plants use chlorophyll to absorb sunlight energy and synthesize carbohydrates from carbon dioxide and water, giving off oxygen. In the light stage, water is split by photolysis yielding electrons, hydrogen ions, ATP, and NADPH for the Calvin cycle.',
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
  console.log('✓ Text Marking Result:');
  console.log('  Total Score:', `${dataMarkText.totalScore} / ${dataMarkText.totalMarks} (${dataMarkText.percentage}%)`);
  console.log('  Q1 Marks:', `${dataMarkText.questionResults?.[q1.id]?.marksAwarded} / ${dataMarkText.questionResults?.[q1.id]?.marksAvailable}`);
  console.log('  Feedback:', dataMarkText.questionResults?.[q1.id]?.feedback);

  // Test 7: Multimodal image answer with unclear image handling
  console.log('\n[Test 7] Calling /api/ai/classroom-mark-theory with handwritten image...');
  const samplePng = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
  const imgAnswers = {
    [q1.id]: {
      type: 'image',
      textContent: '',
      images: [{ url: samplePng, name: 'handwritten_work.png' }],
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
  console.log('✓ Handwritten Image Marking Result:');
  console.log('  isUnclear flag:', dataMarkImg.questionResults?.[q1.id]?.isUnclear);
  console.log('  Feedback:', dataMarkImg.questionResults?.[q1.id]?.feedback);
  console.log('\n--- Tests 5, 6, 7 Complete! ---');
}

testTheoryAssignmentAndMarking().catch(console.error);
