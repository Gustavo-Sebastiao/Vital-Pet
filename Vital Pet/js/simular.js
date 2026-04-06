document.addEventListener('DOMContentLoaded', () => {

    // --- Elements ---
    const phoneInput = document.getElementById('whatsapp-input');
    const btnWhatsapp = document.getElementById('btn-whatsapp');

    const step1 = document.getElementById('step1');
    const step2 = document.getElementById('step2');
    const step3 = document.getElementById('step3'); 

    const stepTitle = document.getElementById('step-title');
    const line2 = document.getElementById('line-2');
    const line3 = document.getElementById('line-3');
    const backBtn = document.getElementById('back-btn');

    // --- State ---
    let petsCart = [];
    let isAnnual = false;
    
    // Forms
    let currentPetId = null; 
    let currentPetSpecies = null;
    let currentPetGender = null;
    let currentPetName = "";
    let currentPlanBasePrice = 65.90; // Default pop
    let currentPlanName = "Vital Pop";
    
    // --- Utils ---
    function formatCurrency(value) {
        return 'R$ ' + value.toFixed(2).replace('.', ',');
    }

    function generateId() {
        return Math.random().toString(36).substr(2, 9);
    }

    // --- Navigation State Management ---
    function goBackToStep1() {
        step2.style.display = 'none';
        step1.style.display = 'block';
        stepTitle.textContent = 'Início';
        line2.classList.remove('active');
        backBtn.onclick = null; // restore
    }

    function goBackToStep2() {
        step3.style.display = 'none';
        step2.style.display = 'block';
        stepTitle.textContent = 'Seu Pet';
        line3.classList.remove('active');
        backBtn.onclick = (e) => {
            e.preventDefault();
            goBackToStep1();
        };
    }

    // --- Render Cart Function ---
    const petsSummaryContainer = document.getElementById('pets-summary-container');
    const totalPriceEl = document.getElementById('total-price');

    function renderCart() {
        petsSummaryContainer.innerHTML = '';
        
        let sum = 0;

        // Render Saved Pets
        petsCart.forEach(pet => {
            const finalPrice = isAnnual ? (pet.planBasePrice * 0.9) : pet.planBasePrice;
            sum += finalPrice;

            const div = document.createElement('div');
            div.className = 'pet-summary-box';
            div.innerHTML = `
                <div class="pet-summary-header">
                    <div class="pet-name">${pet.name} <i class="fa-solid fa-pen edit-saved-pet-name" data-id="${pet.id}" style="color:var(--primary-teal); margin-left:5px; font-size:0.8rem; cursor:pointer;" title="Editar nome"></i></div>
                    <div class="pet-actions">
                        <button class="btn-delete-pet" data-id="${pet.id}"><i class="fa-solid fa-trash"></i></button>
                    </div>
                </div>
                <div class="sp-name">${pet.planName}</div>
                <div class="sp-price">${formatCurrency(finalPrice)}${isAnnual ? '/ano' : '/mês'}</div>
            `;
            petsSummaryContainer.appendChild(div);
        });

        // Render Current Pet being edited (if in step 3)
        if (step3.classList.contains('active')) {
            const currentFinalPrice = isAnnual ? (currentPlanBasePrice * 0.9) : currentPlanBasePrice;
            sum += currentFinalPrice;
            
            const div = document.createElement('div');
            div.className = 'pet-summary-box current-editing-badge';
            div.innerHTML = `
                 <div class="pet-summary-header">
                    <div class="pet-name">${currentPetName} <i class="fa-solid fa-pen" id="edit-current-pet-name" style="color:var(--primary-teal); margin-left:5px; font-size:0.8rem; cursor:pointer;" title="Editar nome"></i></div>
                </div>
                <div class="sp-name">${currentPlanName}</div>
                <div class="sp-price">${formatCurrency(currentFinalPrice)}${isAnnual ? '/ano' : '/mês'}</div>
            `;
            petsSummaryContainer.appendChild(div);
        }

        totalPriceEl.textContent = formatCurrency(sum) + (isAnnual ? '/ano' : '/mês');

        // Attach Delete Listeners
        document.querySelectorAll('.btn-delete-pet').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.getAttribute('data-id');
                petsCart = petsCart.filter(p => p.id !== id);
                renderCart();
            });
        });

        // Attach Edit Name Listeners (Saved Pets)
        document.querySelectorAll('.edit-saved-pet-name').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.getAttribute('data-id');
                const pet = petsCart.find(p => p.id === id);
                if (pet) {
                    const newName = prompt("Como se chama esse pet?", pet.name);
                    if (newName && newName.trim().length > 0) {
                        pet.name = newName.trim();
                        renderCart();
                    }
                }
            });
        });

        // Attach Edit Name Listener (Current Pet)
        const editCurrentNameBtn = document.getElementById('edit-current-pet-name');
        if (editCurrentNameBtn) {
            editCurrentNameBtn.addEventListener('click', () => {
                const newName = prompt("Como se chama esse pet?", currentPetName);
                if (newName && newName.trim().length > 0) {
                    currentPetName = newName.trim();
                    petNameInput.value = currentPetName;
                    dynamicTitleName.textContent = currentPetName;
                    renderCart();
                }
            });
        }
    }

    // --- Step 1: Phone ---
    phoneInput.addEventListener('input', function(e) {
        let x = e.target.value.replace(/\D/g, '').match(/(\d{0,2})(\d{0,5})(\d{0,4})/);
        e.target.value = !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');
        if (e.target.value.length === 15) {
            btnWhatsapp.removeAttribute('disabled');
        } else {
            btnWhatsapp.setAttribute('disabled', 'true');
        }
    });

    phoneInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !btnWhatsapp.hasAttribute('disabled')) {
            btnWhatsapp.click();
        }
    });

    btnWhatsapp.addEventListener('click', () => {
        step1.classList.remove('reveal', 'active');
        step1.style.display = 'none';
        
        step2.classList.remove('hidden');
        step2.classList.add('reveal', 'active');
        step2.style.display = 'block'; 
        
        stepTitle.textContent = 'Seu Pet';
        line2.classList.add('active');
        
        // When reopening step2, we should render cart so if we have previous pets, pricing is updated.
        renderCart();
        
        backBtn.onclick = (e) => {
            e.preventDefault();
            goBackToStep1();
        };
    });

    // --- Step 2: Pet Details ---
    const petChoiceBtns = document.querySelectorAll('.pet-choice-btn');
    const petNameInput = document.getElementById('pet-name-input');
    const btnPetNext = document.getElementById('btn-pet-next');
    const dynamicTitleName = document.getElementById('dynamic-title-name');

    function checkStep2Validation() {
        if (currentPetSpecies && currentPetGender && currentPetName.trim().length > 0) {
            btnPetNext.removeAttribute('disabled');
        } else {
            btnPetNext.setAttribute('disabled', 'true');
        }
    }

    petChoiceBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const type = btn.getAttribute('data-type');
            const val = btn.getAttribute('data-val');
            
            document.querySelectorAll(`.pet-choice-btn[data-type="${type}"]`).forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            
            if (type === 'species') currentPetSpecies = val;
            if (type === 'gender') currentPetGender = val;
            
            checkStep2Validation();
        });
    });

    petNameInput.addEventListener('input', (e) => {
        currentPetName = e.target.value;
        checkStep2Validation();
    });

    petNameInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !btnPetNext.hasAttribute('disabled')) {
            btnPetNext.click();
        }
    });

    // Add Pet Reset logic
    function resetStep2() {
        currentPetId = null;
        currentPetSpecies = null;
        currentPetGender = null;
        currentPetName = "";
        
        petNameInput.value = "";
        petChoiceBtns.forEach(btn => btn.classList.remove('selected'));
        checkStep2Validation();
    }

    btnPetNext.addEventListener('click', () => {
        step2.classList.remove('reveal', 'active');
        step2.style.display = 'none';
        
        step3.classList.remove('hidden');
        step3.classList.add('reveal', 'active');
        step3.style.display = 'block';
        
        stepTitle.textContent = 'Veja os planos';
        line3.classList.add('active');
        
        dynamicTitleName.textContent = currentPetName;
        
        // Default plan selection reset visually
        const popPlanCard = document.querySelector('.plan-radio-card[data-plan="Vital Pop"]');
        if(popPlanCard){
            document.querySelectorAll('.plan-radio-card').forEach(c => c.classList.remove('selected'));
            popPlanCard.classList.add('selected');
            popPlanCard.querySelector('input[type="radio"]').checked = true;
            currentPlanBasePrice = 65.90;
            currentPlanName = "Vital Pop";
        }
        
        renderCart(); // the active pet shows up in summary
        
        backBtn.onclick = (e) => {
            e.preventDefault();
            step3.classList.remove('active'); // hide it from render loop
            goBackToStep2();
            renderCart(); // removes active from render loop
        };
    });

    // --- Step 3: Plan Selection Logic ---
    const planCards = document.querySelectorAll('.plan-radio-card');
    const billingToggles = document.querySelectorAll('.toggle-btn');
    
    planCards.forEach(card => {
        card.addEventListener('click', () => {
            planCards.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            const radio = card.querySelector('input[type="radio"]');
            radio.checked = true;
            
            currentPlanName = card.getAttribute('data-plan');
            currentPlanBasePrice = parseFloat(card.getAttribute('data-price'));
            
            renderCart();
        });
    });

    billingToggles.forEach(btn => {
        btn.addEventListener('click', () => {
            billingToggles.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            isAnnual = btn.getAttribute('data-billing') === 'anual';
            renderCart();
        });
    });

    // --- Add More Pets Logic ---
    const btnAddPet = document.getElementById('btn-add-pet');
    
    btnAddPet.addEventListener('click', () => {
        // 1. Save current to array
        petsCart.push({
            id: generateId(),
            name: currentPetName,
            species: currentPetSpecies,
            gender: currentPetGender,
            planName: currentPlanName,
            planBasePrice: currentPlanBasePrice
        });
        
        // 2. Go back to step 2 visually
        step3.classList.remove('reveal', 'active');
        step3.style.display = 'none';
        
        step2.classList.add('reveal', 'active');
        step2.style.display = 'block';
        
        stepTitle.textContent = 'Seu Pet';
        line3.classList.remove('active');
        
        // 3. Clear forms
        resetStep2();
        
        backBtn.onclick = (e) => {
            e.preventDefault();
            goBackToStep1();
        };
        
        renderCart();
    });

});
