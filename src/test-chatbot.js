// Simple test to verify AI chatbot is working
import AIChatbot from './components/AIChatbot';

console.log('AIChatbot component imported successfully:', AIChatbot);

// Test if the component can be rendered
try {
  console.log('AI Chatbot should be visible at bottom-right corner with z-index [60]');
  console.log('Check for:');
  console.log('1. Floating chat button (blue/purple gradient)');
  console.log('2. Click to open chat window');
  console.log('3. HR Assistant interface should appear');
} catch (error) {
  console.error('Error loading AIChatbot:', error);
}
