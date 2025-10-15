// Fetch chart data from API and render charts
async function loadCharts() {
    try {
        const response = await fetch('/api/chart_data');
        const data = await response.json();
        
        renderCategoryChart(data.categories);
        renderMonthlyChart(data.monthly);
    } catch (error) {
        console.error('Error loading chart data:', error);
    }
}

function renderCategoryChart(categories) {
    const ctx = document.getElementById('categoryChart');
    if (!ctx) return;
    
    // Separate income and expense categories
    const incomeCategories = categories.filter(c => c.type === 'income');
    const expenseCategories = categories.filter(c => c.type === 'expense');
    
    // Prepare data for chart
    const labels = [];
    const incomeData = [];
    const expenseData = [];
    
    // Combine categories
    const allCategories = new Set([...incomeCategories.map(c => c.category), ...expenseCategories.map(c => c.category)]);
    
    allCategories.forEach(category => {
        labels.push(category);
        
        const income = incomeCategories.find(c => c.category === category);
        incomeData.push(income ? income.total : 0);
        
        const expense = expenseCategories.find(c => c.category === category);
        expenseData.push(expense ? expense.total : 0);
    });
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Income',
                    data: incomeData,
                    backgroundColor: 'rgba(76, 175, 80, 0.6)',
                    borderColor: 'rgba(76, 175, 80, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Expenses',
                    data: expenseData,
                    backgroundColor: 'rgba(244, 67, 54, 0.6)',
                    borderColor: 'rgba(244, 67, 54, 1)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Income vs Expenses by Category',
                    font: {
                        size: 16
                    }
                },
                legend: {
                    display: true,
                    position: 'top'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '$' + value.toFixed(2);
                        }
                    }
                }
            }
        }
    });
}

function renderMonthlyChart(monthly) {
    const ctx = document.getElementById('monthlyChart');
    if (!ctx) return;
    
    // Extract unique months
    const months = [...new Set(monthly.map(m => m.month))].sort();
    
    // Prepare data
    const incomeData = [];
    const expenseData = [];
    
    months.forEach(month => {
        const income = monthly.find(m => m.month === month && m.type === 'income');
        incomeData.push(income ? income.total : 0);
        
        const expense = monthly.find(m => m.month === month && m.type === 'expense');
        expenseData.push(expense ? expense.total : 0);
    });
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: months,
            datasets: [
                {
                    label: 'Income',
                    data: incomeData,
                    backgroundColor: 'rgba(76, 175, 80, 0.2)',
                    borderColor: 'rgba(76, 175, 80, 1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'Expenses',
                    data: expenseData,
                    backgroundColor: 'rgba(244, 67, 54, 0.2)',
                    borderColor: 'rgba(244, 67, 54, 1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Monthly Income vs Expenses',
                    font: {
                        size: 16
                    }
                },
                legend: {
                    display: true,
                    position: 'top'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '$' + value.toFixed(2);
                        }
                    }
                }
            }
        }
    });
}

// Load charts when the page loads
document.addEventListener('DOMContentLoaded', loadCharts);
