/**
 * 清除思考過程顯示偏好設定的腳本
 * 在瀏覽器控制台中執行此腳本來重置設定
 */

// 清除思考過程顯示偏好設定
function clearThinkingPreferences() {
  try {
    // 移除 localStorage 中的設定
    localStorage.removeItem('thinking_display_preferences');
    
    console.log('✅ 思考過程顯示偏好設定已清除');
    console.log('🔄 請重新整理頁面以載入新的預設設定');
    
    // 顯示新的預設設定
    const defaultPrefs = {
      showThinking: true,
      mode: "detailed",
      lastUpdated: Date.now(),
      syncWithServer: false
    };
    
    console.log('📋 新的預設設定:', defaultPrefs);
    
    return true;
  } catch (error) {
    console.error('❌ 清除設定時發生錯誤:', error);
    return false;
  }
}

// 檢查目前的設定
function checkCurrentPreferences() {
  try {
    const stored = localStorage.getItem('thinking_display_preferences');
    if (stored) {
      const parsed = JSON.parse(stored);
      console.log('📋 目前的設定:', parsed);
    } else {
      console.log('📋 沒有找到儲存的設定，將使用預設值');
    }
  } catch (error) {
    console.error('❌ 檢查設定時發生錯誤:', error);
  }
}

// 執行清理
console.log('🧹 開始清理思考過程顯示偏好設定...');
console.log('');

console.log('1. 檢查目前設定:');
checkCurrentPreferences();
console.log('');

console.log('2. 清除設定:');
const success = clearThinkingPreferences();
console.log('');

if (success) {
  console.log('3. 驗證清除結果:');
  checkCurrentPreferences();
  console.log('');
  
  console.log('🎉 設定清除完成！');
  console.log('💡 現在重新整理頁面，思考過程應該會預設顯示');
} else {
  console.log('❌ 設定清除失敗，請手動檢查');
}