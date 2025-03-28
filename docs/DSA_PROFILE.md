# DSA Profile Page Documentation

## Overview
The DSA Profile page is designed to display a student's competitive programming progress and achievements from LeetCode and CodeChef platforms. The page features interactive charts and animations to provide an engaging user experience.

## Data Flow

### 1. Registration Process
- Instead of collecting full profile URLs, we now collect only usernames:
  - `leetcodeUsername`: LeetCode username
  - `codechefUsername`: CodeChef username
- These usernames are stored in the Student model

### 2. API Integration
#### LeetCode Stats API
- Base URL: `https://leetcode-stats-api.herokuapp.com/`
- Endpoint: `/{leetcodeUsername}`
- Returns:
  - Total problems solved
  - Easy/Medium/Hard problems solved
  - Acceptance rate
  - Ranking
  - Submission calendar
  - Contribution points
  - Reputation

#### CodeChef API
- Base URL: `https://codechef-api.vercel.app/`
- Endpoint: `/{codechefUsername}`
- Returns:
  - Rating
  - Problems solved
  - Contest participation
  - Submission history
  - Ranking

### 3. Frontend Components Structure

```
DSAProfile/
├── index.jsx                    # Main container component
├── components/
│   ├── LeetCodeSection/        # LeetCode stats section
│   │   ├── index.jsx
│   │   ├── StatsCard.jsx      # Displays key statistics
│   │   ├── DifficultyChart.jsx # Pie chart for problem difficulty
│   │   ├── SubmissionHeatmap.jsx # Calendar heatmap
│   │   └── RatingGraph.jsx    # Line chart for rating progress
│   │
│   ├── CodeChefSection/       # CodeChef stats section
│   │   ├── index.jsx
│   │   ├── StatsCard.jsx     # Displays key statistics
│   │   ├── ContestHistory.jsx # Bar chart for contest performance
│   │   ├── ProblemSolved.jsx # Line chart for problems solved
│   │   └── RatingGraph.jsx   # Line chart for rating progress
│   │
│   └── common/               # Shared components
│       ├── LoadingSpinner.jsx
│       ├── ErrorMessage.jsx
│       └── AnimatedCard.jsx  # Wrapper for hover animations
```

### 4. Data Fetching Strategy
1. **Initial Load**:
   - Fetch both LeetCode and CodeChef data simultaneously
   - Show loading state while fetching
   - Handle errors gracefully

2. **Data Caching**:
   - Cache API responses for 1 hour
   - Implement refresh button for manual updates
   - Show last updated timestamp

### 5. Interactive Features

#### Charts and Visualizations
1. **LeetCode Section**:
   - Animated pie chart showing problem difficulty distribution
   - Interactive heatmap for submission history
   - Line chart for rating progression
   - Hover effects showing detailed statistics

2. **CodeChef Section**:
   - Bar chart for contest performance
   - Line chart for rating progression
   - Problem solved trend graph
   - Interactive tooltips with detailed information

#### Animations
- Fade-in effects for sections
- Smooth transitions for hover states
- Loading animations for data fetching
- Chart animations on data updates

### 6. Error Handling
- Handle API rate limits
- Show fallback UI for failed API calls
- Implement retry mechanism
- Display user-friendly error messages

### 7. Performance Optimization
- Lazy load charts and heavy components
- Implement virtual scrolling for large datasets
- Optimize re-renders using React.memo
- Use web workers for data processing

### 8. Responsive Design
- Mobile-first approach
- Collapsible sections for smaller screens
- Responsive chart sizes
- Touch-friendly interactions

## Implementation Steps

1. **Backend Changes**:
   - Update Student model to store usernames instead of URLs
   - Create API endpoints for fetching platform stats
   - Implement caching mechanism

2. **Frontend Development**:
   - Set up chart libraries (Recharts/D3.js)
   - Create base components structure
   - Implement data fetching logic
   - Add animations and interactions
   - Implement error handling
   - Add responsive design

3. **Testing**:
   - Unit tests for components
   - Integration tests for API calls
   - Performance testing
   - Cross-browser testing

4. **Deployment**:
   - Set up environment variables
   - Configure API endpoints
   - Deploy to production
   - Monitor performance

## Dependencies
- React
- Recharts/D3.js for charts
- Framer Motion for animations
- Axios for API calls
- React Query for data fetching
- Material-UI for components

## Notes
- Ensure proper error handling for API failures
- Implement rate limiting to prevent API abuse
- Consider adding data export functionality
- Plan for future platform additions
- Maintain accessibility standards 