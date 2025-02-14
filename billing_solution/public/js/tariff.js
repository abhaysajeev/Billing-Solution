
  let tariffRows = [];

  // Toggle fields based on checkboxes
  function toggleFields() {
    const fixedChargeChecked = document.getElementById('fixed_charge_check').checked;
    const directComputationCheck = document.getElementById('direct_computation_check').checked;

    document.getElementById('fixedChargeField').style.display = fixedChargeChecked ? 'block' : 'none';
    document.getElementById('fromToUnitField').style.display = directComputationCheck ? 'block' : 'none';
    document.getElementById('tariffField').style.display = directComputationCheck ? 'block' : 'none';
  }

  // Event listeners for checkboxes
  document.getElementById('fixed_charge_check').addEventListener('change', toggleFields);
  document.getElementById('direct_computation_check').addEventListener('change', toggleFields);

  // Initially hide basic amount if no tariff rows exist
  document.querySelector('[data-fieldname="basic_amount"]').closest('.col-md-2').style.display = tariffRows.length === 0 ? 'none' : 'block';

  function addTariffRow() {
    // Ensure basic amount field is visible once tariff rows are present
    document.querySelector('[data-fieldname="basic_amount"]').closest('.basic-amount-column').style.display = tariffRows.length === 0 ? 'none' : 'block';

    const fromUnit = parseFloat(document.querySelector('[data-fieldname="from_unit"]').value) || 0;
    const toUnit = parseFloat(document.querySelector('[data-fieldname="to_unit"]').value) || 0;
    const tariff = parseFloat(document.querySelector('[data-fieldname="tariff"]').value) || 0;
    const perUnit = parseFloat(document.querySelector('[data-fieldname="per_unit"]').value) || 0;

    if (toUnit <= fromUnit) {
      const alertDiv = document.createElement('div');
      alertDiv.className = 'alert alert-danger alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3';
      alertDiv.style.zIndex = '9999';
      alertDiv.style.height = '80px';
      alertDiv.innerHTML = `
        To Unit must be greater than From Unit
        <button class="btn btn-sm btn-close position-absolute top-50 end-0 translate-middle-y" data-bs-dismiss="alert" aria-label="Close"></button>
      `;
      document.body.appendChild(alertDiv);
      setTimeout(() => {
        alertDiv.remove();
      }, 5000);
      return;
    }

    const basicAmount = tariffRows.length > 0 ? tariffRows[tariffRows.length - 1].totalAmount : 0;
    const unitsInRange = toUnit - fromUnit;
    const tariffAmount = (unitsInRange / perUnit) * tariff;
    const totalAmount = basicAmount + tariffAmount;

    tariffRows.push({
      slNo: tariffRows.length + 1,
      fromUnit,
      toUnit,
      tariff,
      perUnit,
      basicAmount,
      totalAmount
    });

    updateTariffTable();
    setupNextRow(toUnit, totalAmount);
    clearInputs();
  }

  function updateTariffTable() {
    const tbody = document.querySelector('table tbody');
    tbody.innerHTML = '';

    tariffRows.forEach((row) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="text-center">${row.slNo}</td>
        <td>${row.fromUnit}</td>
        <td>${row.toUnit}</td>
        <td>${row.tariff.toFixed(2)}</td>
        <td>${row.perUnit}</td>
        <td>${row.basicAmount.toFixed(2)}</td>
        <td>${row.totalAmount.toFixed(2)}</td>
      `;

      // Attach click event to each row for selection/deselection
      tr.addEventListener('click', () => {
        // If the row is already selected, deselect it and reset tariff section
        if(tr.classList.contains('selected')){
          tr.classList.remove('selected');
          resetTariffSection();
        } else {
          // Remove selected class from all rows
          document.querySelectorAll('table tbody tr').forEach(tr => tr.classList.remove('selected'));
          // Mark the clicked row as selected and populate form fields
          tr.classList.add('selected');
          document.querySelector('[data-fieldname="from_unit"]').value = row.fromUnit;
          document.querySelector('[data-fieldname="to_unit"]').value = row.toUnit;
          document.querySelector('[data-fieldname="tariff"]').value = row.tariff;
          document.querySelector('[data-fieldname="per_unit"]').value = row.perUnit;
          document.querySelector('[data-fieldname="basic_amount"]').value = row.basicAmount.toFixed(2);
        }
      });

      tbody.appendChild(tr);
    });
  }

  function setupNextRow(previousToUnit, previousTotal) {
    document.querySelector('[data-fieldname="from_unit"]').value = previousToUnit;
    document.querySelector('[data-fieldname="basic_amount"]').value = previousTotal.toFixed(2);
  }

  function clearInputs() {
    document.querySelector('[data-fieldname="to_unit"]').value = '';
    document.querySelector('[data-fieldname="tariff"]').value = '';
    document.querySelector('[data-fieldname="per_unit"]').value = '';
  }

  // Resets the tariff section to the default state (last row's values or defaults)
  function resetTariffSection() {
    if(tariffRows.length > 0) {
      const lastRow = tariffRows[tariffRows.length - 1];
      document.querySelector('[data-fieldname="from_unit"]').value = lastRow.toUnit;
      document.querySelector('[data-fieldname="basic_amount"]').value = lastRow.totalAmount.toFixed(2);
    } else {
      document.querySelector('[data-fieldname="from_unit"]').value = '0';
      document.querySelector('[data-fieldname="basic_amount"]').value = '0';
    }
    clearInputs();
  }

  // Deletes only the last row in the tariffRows array
  function deleteLastTariffRow() {
    if (tariffRows.length === 0) return;
    tariffRows.pop();
    updateTariffTable();
    if (tariffRows.length > 0) {
      const lastRow = tariffRows[tariffRows.length - 1];
      document.querySelector('[data-fieldname="from_unit"]').value = lastRow.toUnit;
      document.querySelector('[data-fieldname="basic_amount"]').value = lastRow.totalAmount.toFixed(2);
    } else {
      document.querySelector('[data-fieldname="from_unit"]').value = '0';
      document.querySelector('[data-fieldname="basic_amount"]').value = '0';
    }
    clearInputs();
  }

  // Clears the entire tariff table
  function clearTariffTable() {
    tariffRows = [];
    updateTariffTable();
    document.querySelector('[data-fieldname="from_unit"]').value = '0';
    document.querySelector('[data-fieldname="basic_amount"]').value = '0';
    clearInputs();
  }

  // Initialize the table on DOM load
  document.addEventListener('DOMContentLoaded', function() {
    updateTariffTable();
  });
