export const healthHistoryMockData = [
  {
    id: '1',
    date: '2023-11-02T14:30:00Z',
    symptoms: ['Headache', 'Fever', 'Fatigue'],
    prediction: 'Possible Viral Infection',
    severity: 'Medium',
    confidence: 87,
    explanation:
      'The combination of a persistent headache, elevated temperature, and general fatigue strongly suggests a systemic viral response. The high confidence score correlates with typical seasonal flu patterns currently active.',
    precautions: ['Get plenty of rest', 'Maintain high hydration levels', 'Isolate from others to prevent spreading'],
    nextSteps: [
      'Monitor temperature every 4 hours',
      'Consult a doctor if fever persists for more than 3 days',
      'Take over-the-counter antipyretics if needed',
    ],
  },
  {
    id: '2',
    date: '2023-10-28T09:15:00Z',
    symptoms: ['Chest Pain', 'Shortness of Breath', 'Dizziness'],
    prediction: 'Potential Cardiovascular Issue',
    severity: 'High',
    confidence: 92,
    explanation:
      'Chest pain accompanied by shortness of breath and dizziness are hallmark warning signs of a severe cardiovascular or acute respiratory event. Immediate medical evaluation is required.',
    precautions: ['Do not exert yourself', 'Sit or lie down immediately', 'Do not drive yourself to the hospital'],
    nextSteps: ['Seek emergency medical attention immediately (Call 911)', 'Chew an aspirin if available and not allergic'],
  },
  {
    id: '3',
    date: '2023-10-15T18:45:00Z',
    symptoms: ['Runny Nose', 'Sneezing', 'Itchy Eyes'],
    prediction: 'Seasonal Allergies',
    severity: 'Low',
    confidence: 95,
    explanation:
      'These symptoms are highly characteristic of allergic rhinitis, likely triggered by environmental allergens such as pollen, dust mites, or pet dander.',
    precautions: ['Avoid known allergen triggers', 'Keep windows closed during high pollen days', 'Use an air purifier'],
    nextSteps: ['Consider over-the-counter antihistamines', 'Try a saline nasal spray', 'Consult an allergist if symptoms severely impact daily life'],
  },
  {
    id: '4',
    date: '2023-09-05T11:20:00Z',
    symptoms: ['Stomach Ache', 'Nausea', 'Loss of Appetite'],
    prediction: 'Gastroenteritis',
    severity: 'Medium',
    confidence: 78,
    explanation:
      'The grouping of stomach pain, nausea, and loss of appetite frequently indicates inflammation of the digestive tract, commonly known as stomach flu or food poisoning.',
    precautions: ['Avoid solid foods for a few hours', 'Stay away from dairy, caffeine, and spicy foods', 'Wash hands frequently'],
    nextSteps: ['Sip water or electrolyte solutions slowly', 'Gradually reintroduce bland foods (BRAT diet)', 'Seek medical help if unable to keep liquids down for 24 hours'],
  },
];
