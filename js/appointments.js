document.addEventListener("DOMContentLoaded", async () => {
    const userId = localStorage.getItem("userId");
    const tableBody = document.getElementById("appointmentsTableBody");
  
    try {
      const res = await fetch(`http://localhost:5000/api/appointments/${userId}`);
      const appointments = await res.json();
  
      if (res.ok && appointments.length > 0) {
        appointments.forEach((appt) => {
          const { formattedDate, formattedTime } = formatDateTime(appt.date, appt.time);
  
          const row = document.createElement("tr");
          row.innerHTML = `
            <td>${appt.nutritionist_name || 'Nutritionist'}</td>
            <td>${formattedDate}</td>
            <td>${formattedTime}</td>
            <td><button onclick="cancelAppointment(${appt.id})">Cancel</button></td>
          `;
          tableBody.appendChild(row);
        });
      } else {
        tableBody.innerHTML = `<tr><td colspan="4">No appointments found</td></tr>`;
      }
  
    } catch (err) {
      console.error("Error fetching appointments:", err);
      tableBody.innerHTML = `<tr><td colspan="4">Error loading appointments</td></tr>`;
    }
  });
  
  /**
   * Formats date and time separately and combines them.
   * @param {string} dateISO - The ISO string for the date
   * @param {string} timeStr - Optional time string (e.g., "14:30")
   */
  function formatDateTime(dateISO, timeStr = "") {
    const dateObj = new Date(dateISO);
    const dateOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    const formattedDate = dateObj.toLocaleDateString('en-IN', dateOptions);
  
    // If time is provided separately (e.g. from DB column)
    let formattedTime = "—";
    if (timeStr) {
      const [hour, minute] = timeStr.split(":");
      const timeObj = new Date();
      timeObj.setHours(parseInt(hour), parseInt(minute));
      formattedTime = timeObj.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
    } else {
      // fallback: try from full ISO string
      formattedTime = dateObj.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
    }
  
    return { formattedDate, formattedTime };
  }
  
  async function cancelAppointment(appointmentId) {
    const confirmCancel = confirm("Are you sure you want to cancel this appointment?");
    if (!confirmCancel) return;
  
    try {
      const res = await fetch(`http://localhost:5000/api/appointments/${appointmentId}`, {
        method: "DELETE",
      });
  
      if (res.ok) {
        alert("Appointment cancelled.");
        location.reload(); // Refresh the page to update the list
      } else {
        const data = await res.json();
        alert(data.message || "Failed to cancel appointment.");
      }
  
    } catch (err) {
      console.error("Error cancelling appointment:", err);
      alert("Server error while cancelling.");
    }
  }
  