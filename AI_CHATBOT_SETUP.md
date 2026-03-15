# AI Chatbot Integration Setup

This guide will help you set up the Gemini AI-powered chatbot for real-time HR support in your HRMS system.

## 🤖 Features

- **Real-time AI Support**: Powered by Google Gemini AI
- **HR-Specific Context**: Trained for HR-related queries
- **Interactive UI**: Modern chat interface with animations
- **Quick Actions**: Pre-defined common questions
- **Responsive Design**: Works on all devices
- **Minimize/Maximize**: Flexible chat window management

## 🚀 Setup Instructions

### 1. Get Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key

### 2. Configure Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` file and add your API key:
   ```env
   REACT_APP_GEMINI_API_KEY=your_actual_gemini_api_key_here
   ```

### 3. Install Dependencies (if needed)

The chatbot uses built-in React hooks and fetch API, so no additional dependencies are required.

### 4. Restart Development Server

```bash
npm start
```

## 💬 Chatbot Capabilities

### HR Topics Covered
- ✅ Employee management policies
- ✅ Leave request procedures
- ✅ Attendance and time-off
- ✅ Payroll and salary inquiries
- ✅ Benefits and compensation
- ✅ IT support and technical help
- ✅ Department procedures
- ✅ Performance reviews
- ✅ Training and development

### Smart Features
- **Context Awareness**: Knows it's an HR assistant
- **Professional Tone**: Maintains HR-appropriate language
- **Safety Guidelines**: Redirects sensitive data to official channels
- **Quick Actions**: One-click common questions
- **Typing Indicators**: Real-time feedback
- **Message History**: Maintains conversation context

## 🎨 UI Features

### Chat Window
- **Floating Button**: Gradient design with hover effects
- **Expandable**: Minimize/maximize functionality
- **Message Bubbles**: Different colors for user/bot
- **Timestamps**: Shows message times
- **Auto-scroll**: Always shows latest messages
- **Clear Chat**: Reset conversation option

### Quick Actions
- "How to apply for leave?" 📝
- "Check attendance policy" 📅
- "Salary inquiry" 💰
- "IT support" 💻

### Responsive Design
- **Mobile Optimized**: Works on small screens
- **Desktop Enhanced**: Larger chat window on desktop
- **Touch Friendly**: Proper tap targets
- **Keyboard Support**: Enter to send, Shift+Enter for new line

## 🔧 Technical Implementation

### API Integration
```javascript
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`;
```

### Error Handling
- Network errors with user-friendly messages
- API rate limiting awareness
- Graceful fallback responses
- Console logging for debugging

### Security Considerations
- API key stored in environment variables
- Input sanitization
- Response filtering
- No sensitive data logging

## 📱 Usage Instructions

### For Employees
1. Click the chat button (bottom-right corner)
2. Type your HR-related question
3. Use quick actions for common queries
4. Get instant AI-powered responses

### For Admins
1. Monitor chatbot usage (if logging is implemented)
2. Update HR context as policies change
3. Monitor API usage and costs
4. Collect feedback for improvements

## 🛠️ Customization

### Updating HR Context
Edit the `generateHRContext()` function in `AIChatbot.jsx` to:
- Add new HR policies
- Update department information
- Modify response guidelines
- Add company-specific information

### Styling Changes
- Colors: Modify gradient classes in chat button
- Size: Adjust width/height in chat window
- Icons: Change React Icons in the component
- Animations: Modify Tailwind animation classes

### Adding Quick Actions
Update the `quickActions` array:
```javascript
const quickActions = [
  { text: "Your new action", icon: "🎯" },
  // ... existing actions
];
```

## 🔍 Troubleshooting

### Common Issues

#### API Key Not Working
- Verify the key is correctly copied
- Check `.env` file location
- Ensure `REACT_APP_GEMINI_API_KEY` prefix is used
- Restart development server after changes

#### Chatbot Not Responding
- Check browser console for errors
- Verify internet connection
- Check API quota limits
- Test API key in Google AI Studio

#### Styling Issues
- Ensure Tailwind CSS is properly loaded
- Check for CSS conflicts
- Verify responsive breakpoints
- Test on different screen sizes

#### Performance Issues
- Monitor API response times
- Implement response caching if needed
- Consider debouncing user input
- Optimize re-renders

### Debug Mode
Add console logging to debug:
```javascript
console.log('API Response:', data);
console.log('User Message:', message);
```

## 📊 Monitoring

### API Usage
- Monitor Gemini API usage in Google Cloud Console
- Track response times and success rates
- Set up usage alerts if needed

### User Feedback
- Collect user satisfaction ratings
- Track common question patterns
- Monitor conversation completion rates
- Analyze fallback usage

## 🔮 Future Enhancements

### Planned Features
- [ ] Voice input/output
- [ ] Multi-language support
- [ ] File upload for HR documents
- [ ] Integration with HR database
- [ ] Agent handoff for complex issues
- [ ] Analytics dashboard
- [ ] Custom branding options

### Advanced AI Features
- [ ] Sentiment analysis
- [ ] Intent recognition
- [ ] Personalized responses
- [ ] Proactive suggestions
- [ ] Learning from interactions

## 📞 Support

If you encounter issues:
1. Check this troubleshooting guide
2. Review browser console errors
3. Verify API key configuration
4. Test with a fresh API key
5. Contact development team

---

**Note**: This chatbot is designed to assist with general HR inquiries. For sensitive personal data, complex issues, or official HR actions, always direct users to the appropriate HR channels or contact HR department directly.
