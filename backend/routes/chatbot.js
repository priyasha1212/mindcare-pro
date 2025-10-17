const express = require('express');
const router = express.Router();

// Advanced AI responses with comprehensive mental health expertise
const aiResponses = {
  greetings: [
    "Hello! I'm your MindCare AI assistant. I'm trained to provide mental health support, coping strategies, and empathetic listening. How are you feeling right now?",
    "Welcome to MindCare! I'm here to offer emotional support and evidence-based mental health guidance. Whatever you're experiencing, I'll listen without judgment and help you find ways forward.",
    "Hi there! I'm your mental wellness companion. Whether you need someone to talk to, practical coping techniques, or just a moment of calm understanding, I'm here for you."
  ],
  
  anxiety: [
    "I understand anxiety can feel overwhelming, like you're carrying a heavy weight. Let's try the 5-4-3-2-1 grounding technique together: Look around and name 5 things you can see, 4 things you can touch, 3 things you can hear, 2 things you can smell, and 1 thing you can taste. This sensory awareness can help bring you back to the present moment when worries feel too big.",
    "When anxiety strikes, remember the 4-7-8 breathing technique: Inhale quietly through your nose for 4 seconds, hold your breath for 7 seconds, and exhale completely through your mouth for 8 seconds. Repeat this 3-4 times. This activates your parasympathetic nervous system, signaling safety to your body and calming the fight-or-flight response.",
    "Anxiety often comes from worrying about future possibilities. Try this perspective shift: Ask yourself 'What's actually happening right now?' rather than 'What might happen?' Focus on the present reality, not future scenarios. What's one small, manageable thing you can do right now to feel even 1% more grounded?"
  ],
  
  depression: [
    "I hear you're going through a difficult time. Depression can make everything feel heavy and overwhelming, like moving through thick fog. Remember that your feelings are valid, and even small accomplishments like getting out of bed, brushing your teeth, or drinking water are meaningful steps worth acknowledging.",
    "When depression makes motivation feel impossible, try the 'five-minute rule': Commit to an activity for just five minutes. Often, starting is the hardest part. If after five minutes you want to stop, that's completely okay - you've already accomplished something significant. If you continue, that's a bonus. This approach respects your energy levels while building gentle momentum.",
    "You're not alone in this struggle. Many people experience depression, and it's okay to not be okay. The fact that you're reaching out shows incredible strength and self-awareness. Consider reaching out to trusted friends, family, or mental health professionals for additional support. Sometimes sharing the emotional load makes it easier to carry."
  ],
  
  stress: [
    "Stress can really accumulate and affect both mind and body. Let's try progressive muscle relaxation: Tense each muscle group for 5 seconds, then release completely. Start from your toes and work upward - feet, calves, thighs, glutes, stomach, hands, arms, shoulders, neck, and face. Notice the difference between tension and relaxation in each area. This practice helps release physical stress stored in the body.",
    "When stress builds up, sometimes externalizing it can help. Try the 'circle of control' exercise: Draw two circles. In the inner circle, list things you can control (your reactions, self-care, boundaries, effort). In the outer circle, list things you can't control (others' actions, past events, certain outcomes). Focus your energy on the inner circle where you have actual influence and let go of what's outside your control.",
    "Remember the three R's of stress management: Recognize your stress signals early (irritability, fatigue, muscle tension, sleep changes), Reduce your exposure to stressors when possible (set boundaries, delegate tasks, say no), and build Resilience through consistent self-care practices (adequate sleep, balanced nutrition, regular movement, social connection)."
  ],
  
  anger: [
    "Anger is a natural emotion that signals something important to us feels threatened or unfair. When you feel anger rising, try the 'time out' method - remove yourself from the situation for 10-15 minutes to cool down before responding. Use this time to breathe, walk, or splash cold water on your face. This space can help you respond thoughtfully rather than react impulsively.",
    "Physical release can help with anger's intense energy. Try squeezing a stress ball, punching a pillow, or doing vigorous exercise like running, jumping jacks, or dancing. The goal is to release the physical energy of anger in a safe way that doesn't harm yourself or others. Afterwards, you can address the situation more calmly.",
    "Use 'I feel' statements to express anger constructively: 'I feel angry when... because... I would prefer...' This framework helps communicate your needs and boundaries without blaming others, which increases the chance of being understood and finding resolution."
  ],
  
  loneliness: [
    "Feeling lonely can be incredibly painful, like there's an empty space where connection should be. Remember that loneliness is a common human experience, and it doesn't mean you're unlikeable or unworthy of connection. Many people feel lonely even when surrounded by others - it's about the quality, not just quantity, of connections.",
    "Start with small social connections that feel manageable: Smile at a stranger, make brief eye contact with someone, send a simple 'thinking of you' text to an old friend, or leave a kind comment online. Small, low-pressure interactions can build momentum and confidence for larger connections over time.",
    "Consider joining online communities related to your genuine interests - book clubs, gaming groups, hobby forums, or support groups. Sometimes digital connections can be comfortable stepping stones to in-person relationships. What activities or topics have you enjoyed in the past?"
  ],
  
  sleep: [
    "Sleep difficulties often accompany emotional struggles. Try establishing a consistent 'wind down' routine 60 minutes before bed: dim lights, no screens, gentle stretching, reading a physical book, listening to calm music, or taking a warm bath. This signals to your brain that it's time to shift from doing mode to resting mode.",
    "If you can't sleep, instead of staying in bed frustrated, try the 15-minute rule: If you're not asleep after 15-20 minutes, get up, go to another room, do something calming in dim light (read, listen to soft music, gentle stretching), then return to bed when you feel sleepy. This helps associate your bed with sleep rather than frustration and wakefulness.",
    "Practice the 4-7-8 breathing technique in bed: Inhale through your nose for 4 seconds, hold for 7 seconds, exhale through your mouth for 8 seconds. This triggers the relaxation response and can help quiet racing thoughts. Imagine your thoughts as clouds passing by - acknowledge them without holding on or following them."
  ],
  
  motivation: [
    "When motivation feels elusive, focus on 'activation' rather than motivation. Action often comes before feeling motivated. What's one tiny step you could take right now? Even opening a document, putting on workout clothes, or gathering materials counts as progress.",
    "Use the 'two-minute rule' - if a task takes less than two minutes, do it immediately. This builds momentum and creates small wins. For larger tasks, break them into 'micro-tasks' - instead of 'clean kitchen', try 'put away 5 items' or 'wipe one counter'. Small completions create a sense of accomplishment.",
    "Connect tasks to your values and 'why'. Instead of 'I should exercise', try 'I'm moving my body because I value health and feeling energized'. Or instead of 'I have to work', try 'I'm taking this step toward my goals because I value growth and contribution'. Connecting to deeper meaning can reignite motivation."
  ],
  
  self_esteem: [
    "Low self-esteem often comes from focusing on perceived flaws while overlooking strengths. Try the 'three good things' exercise: Each day, write down three things you did well or handled effectively, no matter how small. This practice gradually shifts focus toward your capabilities and positive qualities.",
    "Practice replacing harsh self-criticism with compassionate self-talk. When you notice negative self-talk, ask 'Would I say this to a friend I care about?' If not, rephrase it with the same kindness and understanding you'd offer someone you love. You deserve that same compassion.",
    "Create an 'accomplishment jar' - write down small achievements, positive moments, and things you're proud of on slips of paper. When you need a self-esteem boost, read through them. This tangible reminder of your strengths and progress can be powerfully affirming."
  ],
  
  relationships: [
    "Healthy communication involves both expressing yourself clearly and listening to understand. Practice active listening - focus completely on understanding the other person's perspective and feelings before formulating your response. This builds trust and mutual understanding.",
    "Setting clear boundaries is essential for healthy relationships. Identify what you're comfortable with and communicate it respectfully using 'I' statements: 'I feel uncomfortable when... I would prefer...' or 'I need... to feel respected in this relationship.' Boundaries protect your wellbeing while maintaining connection.",
    "Practice empathy by genuinely trying to understand the other person's feelings and perspective, even when you disagree. This doesn't mean abandoning your own needs or boundaries. Empathy helps de-escalate conflicts and find common ground while honoring both people's experiences."
  ],
  
  crisis: [
    "I'm very concerned about what you're sharing. Your safety is the most important thing right now. Please reach out to emergency services or a crisis helpline immediately. In India, you can call Vandrevala Foundation at 1860-2662-345 or the national emergency number 112. You don't have to face this alone - there are people trained to help right now.",
    "This sounds very serious, and I want to make sure you get proper support immediately. Please contact emergency services or a crisis helpline right away. Your life matters, and there are people who can help you through this difficult time. You deserve support and care.",
    "I'm deeply concerned about your safety. Please connect with emergency services or a crisis support line immediately - they're specifically trained to help in situations like this. Your wellbeing is crucial, and professional support is available right now."
  ],
  
  general_support: [
    "Thank you for sharing that with me. It takes courage to talk about these things, and I appreciate you trusting me. How has this been affecting your daily life and overall sense of wellbeing?",
    "I appreciate you opening up about this. Mental health journeys often have both challenges and moments of growth - what you're experiencing is valid and understandable. What kind of support would feel most helpful for you right now?",
    "That sounds really challenging to navigate. Remember that seeking support and talking about difficult experiences shows strength and self-awareness, not weakness. What's one small thing that usually helps you feel even slightly more grounded or comforted?",
    "I'm listening carefully to what you're sharing. Sometimes just expressing our thoughts and feelings out loud can provide some relief and clarity. Would you like to explore this further together, or would you prefer some specific coping strategies right now?",
    "Thank you for trusting me with this. Your feelings matter, and whatever you're experiencing is valid. What would be most supportive for you in this moment - practical strategies, emotional validation, space to process, or something else entirely?",
    "I hear the difficulty and pain in what you're sharing. It's okay to not have all the answers or know exactly what you need right now. What do you think might help you feel even a little bit supported or understood in this moment?",
    "You're dealing with a lot right now. Remember to be gentle with yourself - healing and growth aren't linear processes, and it's okay to have difficult days. What would feel like a kind, manageable step forward from where you are right now?"
  ]
};

// Advanced response matching with context awareness
const getAIResponse = (message, conversationHistory = []) => {
  const lowerMessage = message.toLowerCase();
  const recentContext = conversationHistory.slice(-4).join(' ').toLowerCase();

  // Crisis detection - highest priority
  if (/(suicide|kill myself|end it all|want to die|not worth living|harm myself|ending it)/i.test(lowerMessage)) {
    return aiResponses.crisis[Math.floor(Math.random() * aiResponses.crisis.length)];
  }

  // Greeting detection for new conversations
  if (/(hello|hi|hey|greetings|good morning|good afternoon)/i.test(lowerMessage) && conversationHistory.length < 2) {
    return aiResponses.greetings[Math.floor(Math.random() * aiResponses.greetings.length)];
  }

  // Context-aware responses based on conversation history
  if (recentContext.includes('anxious') || recentContext.includes('worry') || recentContext.includes('panic') ||
      /(anxious|anxiety|nervous|worried|panic|overwhelmed|scared|fear|overthink)/i.test(lowerMessage)) {
    return aiResponses.anxiety[Math.floor(Math.random() * aiResponses.anxiety.length)];
  }

  if (recentContext.includes('depress') || recentContext.includes('sad') || recentContext.includes('hopeless') ||
      /(depress|sad|down|hopeless|empty|miserable|blue|unhappy|worthless)/i.test(lowerMessage)) {
    return aiResponses.depression[Math.floor(Math.random() * aiResponses.depression.length)];
  }

  if (recentContext.includes('stress') || recentContext.includes('overwhelm') || recentContext.includes('pressure') ||
      /(stress|overwhelm|pressure|burnout|too much|can't handle|exhausted)/i.test(lowerMessage)) {
    return aiResponses.stress[Math.floor(Math.random() * aiResponses.stress.length)];
  }

  if (recentContext.includes('angry') || recentContext.includes('mad') || recentContext.includes('frustrat') ||
      /(angry|mad|furious|rage|annoyed|frustrated|pissed|irritated)/i.test(lowerMessage)) {
    return aiResponses.anger[Math.floor(Math.random() * aiResponses.anger.length)];
  }

  if (recentContext.includes('lonely') || recentContext.includes('alone') || recentContext.includes('isolated') ||
      /(lonely|alone|isolated|no friends|no one cares| disconnected)/i.test(lowerMessage)) {
    return aiResponses.loneliness[Math.floor(Math.random() * aiResponses.loneliness.length)];
  }

  if (recentContext.includes('sleep') || recentContext.includes('tired') || recentContext.includes('insomnia') ||
      /(can't sleep|insomnia|tired|exhausted|sleep problem|awake|wake up)/i.test(lowerMessage)) {
    return aiResponses.sleep[Math.floor(Math.random() * aiResponses.sleep.length)];
  }

  if (recentContext.includes('motivat') || recentContext.includes('procrastinate') || recentContext.includes('stuck') ||
      /(motivat|procrastinat|lazy|unproductive|can't start|no energy|stuck)/i.test(lowerMessage)) {
    return aiResponses.motivation[Math.floor(Math.random() * aiResponses.motivation.length)];
  }

  if (recentContext.includes('self-esteem') || recentContext.includes('confidence') || recentContext.includes('worth') ||
      /(ugly|stupid|worthless|not good enough|hate myself|low confidence|inadequate)/i.test(lowerMessage)) {
    return aiResponses.self_esteem[Math.floor(Math.random() * aiResponses.self_esteem.length)];
  }

  if (recentContext.includes('relationship') || recentContext.includes('friend') || recentContext.includes('partner') ||
      /(relationship|friend|partner|family|communication|argument|fight|conflict)/i.test(lowerMessage)) {
    return aiResponses.relationships[Math.floor(Math.random() * aiResponses.relationships.length)];
  }

  // Default to general supportive responses
  return aiResponses.general_support[Math.floor(Math.random() * aiResponses.general_support.length)];
};

router.post('/message', (req, res) => {
  const { message, conversationHistory = [] } = req.body;
  
  if (!message) {
    return res.status(400).json({
      success: false,
      error: 'Message is required'
    });
  }

  // Simulate AI processing delay
  setTimeout(() => {
    const response = getAIResponse(message, conversationHistory);

    res.json({
      success: true,
      response,
      timestamp: new Date().toISOString()
    });
  }, 800 + Math.random() * 400); // Reduced delay for better UX
});

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    response_categories: Object.keys(aiResponses).length,
    version: '2.0'
  });
});

module.exports = router;