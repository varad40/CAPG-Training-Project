function loadPage(page) {
  fetch(`pages/${page}`)
      .then(response => response.text())
      .then(data => {
          const container = document.getElementById('main-content');
          container.innerHTML = data;

          // Extract and evaluate scripts manually
          const scripts = container.querySelectorAll('script');
          scripts.forEach(script => {
              const newScript = document.createElement('script');
              if (script.src) {
                  newScript.src = script.src;
              } else {
                  newScript.textContent = script.textContent;
              }
              document.body.appendChild(newScript);
              script.remove(); // Optional: remove the original script tag
          });
      })
      .catch(err => {
          document.getElementById('main-content').innerHTML =
              '<p class="text-danger">Failed to load content.</p>';
          console.error(err);
      });
}