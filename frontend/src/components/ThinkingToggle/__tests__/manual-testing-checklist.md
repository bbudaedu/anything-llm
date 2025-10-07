# Manual Testing Checklist for Agent Thinking Toggle Feature

## Test Environment Setup

- [ ] Ensure development environment is running (server, frontend, collector)
- [ ] Have both admin and non-admin user accounts available
- [ ] Test in both single-user and multi-user modes
- [ ] Test across different browsers (Chrome, Firefox, Safari, Edge)
- [ ] Test on different screen sizes (desktop, tablet, mobile)

## 1. Admin Role and Permission Testing

### Single User Mode

- [ ] **Test 1.1**: Admin user can see the eye icon toggle button in PromptInput area
- [ ] **Test 1.2**: Eye icon is positioned correctly next to other controls
- [ ] **Test 1.3**: Button shows appropriate tooltip on hover
- [ ] **Test 1.4**: Button has proper accessibility attributes (ARIA labels, role="switch")
- [ ] **Test 1.5**: Button responds to keyboard navigation (Tab to focus, Enter/Space to activate)

### Multi-User Mode

- [ ] **Test 1.6**: Admin user can see the eye icon toggle button
- [ ] **Test 1.7**: Non-admin users (default, manager) cannot see the eye icon button
- [ ] **Test 1.8**: Button functionality works correctly for admin users
- [ ] **Test 1.9**: Settings are applied globally for all users

## 2. Thinking Process Display Control

### Basic Toggle Functionality

- [ ] **Test 2.1**: Clicking eye icon toggles between show/hide states
- [ ] **Test 2.2**: Eye icon changes appearance (filled vs outline) based on state
- [ ] **Test 2.3**: Tooltip text updates based on current state
- [ ] **Test 2.4**: ARIA pressed attribute updates correctly
- [ ] **Test 2.5**: State persists across page refreshes

### LLM Thinking Process Control

- [ ] **Test 2.6**: When thinking is enabled, full LLM reasoning is displayed
- [ ] **Test 2.7**: When thinking is disabled, only progress indicators are shown
- [ ] **Test 2.8**: Transition between modes is smooth and immediate
- [ ] **Test 2.9**: Existing detailed mode functionality is preserved when enabled

### @Agent Mode Thinking Process Control

- [ ] **Test 2.10**: Agent thinking process respects global toggle setting
- [ ] **Test 2.11**: Agent status updates show appropriately in both modes
- [ ] **Test 2.12**: Agent error messages are still visible when thinking is disabled
- [ ] **Test 2.13**: Agent progress indicators work in simplified mode

## 3. Default Behavior Testing

### Initial State

- [ ] **Test 3.1**: System defaults to thinking process disabled (eye closed)
- [ ] **Test 3.2**: New users see simplified interface by default
- [ ] **Test 3.3**: First-time admin users see the toggle but thinking is off
- [ ] **Test 3.4**: Settings are properly initialized on first load

### State Persistence

- [ ] **Test 3.5**: Settings persist in localStorage (single-user mode)
- [ ] **Test 3.6**: Settings persist in system database (multi-user mode)
- [ ] **Test 3.7**: Settings sync across browser tabs/windows
- [ ] **Test 3.8**: Settings survive browser restart

## 4. Global Settings Impact

### Multi-User Mode

- [ ] **Test 4.1**: Admin changes affect all users immediately
- [ ] **Test 4.2**: Non-admin users see changes without page refresh
- [ ] **Test 4.3**: Multiple admin users can modify settings
- [ ] **Test 4.4**: Settings changes are logged in system events

### Single-User Mode

- [ ] **Test 4.5**: Settings are user-specific and don't affect others
- [ ] **Test 4.6**: Settings work correctly in single-user installations

## 5. Progress Indicators and Simplified Display

### Content Filtering

- [ ] **Test 5.1**: Important errors are still shown when thinking is disabled
- [ ] **Test 5.2**: User input requests are visible in simplified mode
- [ ] **Test 5.3**: Critical status updates are not filtered out
- [ ] **Test 5.4**: Progress indicators show meaningful information

### Display Quality

- [ ] **Test 5.5**: Simplified display is clean and informative
- [ ] **Test 5.6**: Progress indicators are visually appealing
- [ ] **Test 5.7**: Transition between modes doesn't cause layout shifts
- [ ] **Test 5.8**: Content is properly sanitized and safe

## 6. Keyboard Shortcuts and Accessibility

### Keyboard Shortcuts

- [ ] **Test 6.1**: Ctrl+Shift+T toggles thinking display (Windows/Linux)
- [ ] **Test 6.2**: Cmd+Shift+T toggles thinking display (Mac)
- [ ] **Test 6.3**: Keyboard shortcuts only work for authorized users
- [ ] **Test 6.4**: Shortcuts work from any focused element on the page

### Accessibility

- [ ] **Test 6.5**: Screen readers announce button state changes
- [ ] **Test 6.6**: Button is keyboard navigable
- [ ] **Test 6.7**: Focus indicators are visible and clear
- [ ] **Test 6.8**: Color contrast meets accessibility standards
- [ ] **Test 6.9**: Button works with high contrast mode
- [ ] **Test 6.10**: Tooltips are accessible to screen readers

## 7. Error Handling and Edge Cases

### Network Errors

- [ ] **Test 7.1**: Graceful handling of API failures
- [ ] **Test 7.2**: Fallback to localStorage when server is unavailable
- [ ] **Test 7.3**: Appropriate error messages for users
- [ ] **Test 7.4**: Recovery when network connection is restored

### Permission Errors

- [ ] **Test 7.5**: Proper handling when user loses admin privileges
- [ ] **Test 7.6**: Button disappears when user role changes
- [ ] **Test 7.7**: No console errors for unauthorized access attempts

### Data Corruption

- [ ] **Test 7.8**: Recovery from corrupted localStorage data
- [ ] **Test 7.9**: Handling of invalid server responses
- [ ] **Test 7.10**: Graceful degradation when features are unavailable

## 8. Performance and User Experience

### Loading States

- [ ] **Test 8.1**: Loading spinner shows during initialization
- [ ] **Test 8.2**: Button is disabled during state changes
- [ ] **Test 8.3**: No flickering during state transitions
- [ ] **Test 8.4**: Smooth animations and transitions

### Responsiveness

- [ ] **Test 8.5**: Button scales appropriately on mobile devices
- [ ] **Test 8.6**: Touch interactions work correctly
- [ ] **Test 8.7**: Layout remains stable across screen sizes
- [ ] **Test 8.8**: Performance is acceptable on slower devices

## 9. Integration with Existing Features

### Chat Interface

- [ ] **Test 9.1**: Toggle doesn't interfere with chat functionality
- [ ] **Test 9.2**: Message sending works in both thinking modes
- [ ] **Test 9.3**: Chat history displays correctly in both modes
- [ ] **Test 9.4**: Streaming responses work with thinking control

### Workspace Features

- [ ] **Test 9.5**: Feature works across different workspaces
- [ ] **Test 9.6**: Settings are consistent across workspace switches
- [ ] **Test 9.7**: No conflicts with workspace-specific settings

## 10. Cross-Browser and Device Testing

### Browser Compatibility

- [ ] **Test 10.1**: Chrome (latest version)
- [ ] **Test 10.2**: Firefox (latest version)
- [ ] **Test 10.3**: Safari (latest version)
- [ ] **Test 10.4**: Edge (latest version)
- [ ] **Test 10.5**: Mobile browsers (iOS Safari, Chrome Mobile)

### Device Testing

- [ ] **Test 10.6**: Desktop (Windows, Mac, Linux)
- [ ] **Test 10.7**: Tablet (iPad, Android tablets)
- [ ] **Test 10.8**: Mobile phones (iOS, Android)

## 11. Internationalization

### Language Support

- [ ] **Test 11.1**: English interface works correctly
- [ ] **Test 11.2**: Chinese interface works correctly
- [ ] **Test 11.3**: Tooltips and labels are properly translated
- [ ] **Test 11.4**: Error messages are localized
- [ ] **Test 11.5**: RTL languages display correctly (if supported)

## 12. Security Testing

### Permission Validation

- [ ] **Test 12.1**: Non-admin users cannot access admin endpoints
- [ ] **Test 12.2**: API endpoints properly validate user roles
- [ ] **Test 12.3**: No sensitive information exposed in client-side code
- [ ] **Test 12.4**: CSRF protection is maintained

### Data Security

- [ ] **Test 12.5**: Settings data is properly sanitized
- [ ] **Test 12.6**: No XSS vulnerabilities in thinking content display
- [ ] **Test 12.7**: Secure transmission of settings data

## Test Results Documentation

### Pass/Fail Tracking

For each test, document:

- [ ] **Status**: Pass/Fail/Not Applicable
- [ ] **Browser/Device**: Where tested
- [ ] **Notes**: Any issues or observations
- [ ] **Screenshots**: For visual issues
- [ ] **Reproduction Steps**: For any failures

### Critical Issues

Document any critical issues that prevent the feature from working:

- Issue description
- Steps to reproduce
- Expected vs actual behavior
- Impact assessment
- Proposed fix

### Performance Metrics

- [ ] Page load time impact
- [ ] Memory usage
- [ ] Network requests
- [ ] Rendering performance

## Final Validation Checklist

Before marking the feature as complete:

- [ ] All critical functionality tests pass
- [ ] No console errors in any supported browser
- [ ] Accessibility requirements are met
- [ ] Performance is acceptable
- [ ] Security requirements are satisfied
- [ ] Documentation is complete and accurate
- [ ] Code review is completed
- [ ] All requirements from the specification are implemented
