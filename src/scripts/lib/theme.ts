(() => {
  const htmlRootElement = document.documentElement as HTMLHtmlElement;
  const toggleThemeButton = document.getElementById('toggle-theme-btn') as HTMLButtonElement;

  if (!toggleThemeButton) return;

  const handleToggle = () => {
    htmlRootElement.classList.toggle('dark');

    const isDark = htmlRootElement.classList.contains('dark');

    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  };

  toggleThemeButton.addEventListener('click', handleToggle);
})();
