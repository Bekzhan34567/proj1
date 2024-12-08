async function toggleFavorite(id) {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch(
      `http://localhost:3000/entries/${id}/favorite`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();
    alert(data.message); // Показать сообщение о успешном обновлении
    fetchEntries();
  } catch (error) {
    console.error("Error updating favorite status:", error);
    alert("An error occurred while updating the favorite status.");
  }
}

function renderEntries(entries) {
  entriesList.innerHTML = "";
  entries.forEach((entry) => {
    const entryElement = document.createElement("div");
    entryElement.innerHTML = `
      <h3>${entry.title}</h3>
      <p>${entry.summary}</p>
      <small>${new Date(entry.date).toLocaleString()}</small>
      <button onclick="toggleFavorite(${entry.id})">
        ${entry.isFavorite ? "Remove from favorites" : "Add to favorites"}
      </button>
      <button onclick="deleteEntry(${entry.id})">Delete</button>
    `;
    entriesList.appendChild(entryElement);
  });
}
