// script.js
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Firebase
    const auth = window.firebase.auth;
    const database = window.firebase.database;
    const storage = window.firebase.storage;
    const ref = window.firebase.ref;
    const set = window.firebase.set;
    const push = window.firebase.push;
    const onValue = window.firebase.onValue;
    const update = window.firebase.update;
    const remove = window.firebase.remove;
    const storageRef = window.firebase.storageRef;
    const uploadBytes = window.firebase.uploadBytes;
    const getDownloadURL = window.firebase.getDownloadURL;
    const signInWithEmailAndPassword = window.firebase.signInWithEmailAndPassword;
    const signInWithPopup = window.firebase.signInWithPopup;
    const GoogleAuthProvider = window.firebase.GoogleAuthProvider;
    const sendPasswordResetEmail = window.firebase.sendPasswordResetEmail;

    // Check if user has accepted terms
    checkTermsAcceptance();

    // Check maintenance mode
    checkMaintenanceMode();

    // Initialize typing animation
    initTypingAnimation();

    // Initialize designs
    loadDesigns();

    // Initialize ads
    loadAds();

    // Initialize mobile menu
    initMobileMenu();

    // Initialize smooth scrolling
    initSmoothScrolling();

    // Initialize skill animations
    initSkillAnimations();

    // Initialize contact form
    initContactForm();

    // Initialize login functionality if on login page
    if (document.getElementById('login-form')) {
        initLoginForm();
    }

    // Initialize admin functionality if on admin page
    if (document.getElementById('admin-dashboard')) {
        initAdminDashboard();
    }

    // Function to check terms acceptance
    function checkTermsAcceptance() {
        const termsAccepted = localStorage.getItem('termsAccepted');
        if (!termsAccepted) {
            setTimeout(() => {
                document.getElementById('terms-modal').classList.add('active');
            }, 2000);
        }
    }

    // Function to check maintenance mode
    function checkMaintenanceMode() {
        const maintenanceRef = ref(database, 'maintenance');
        onValue(maintenanceRef, (snapshot) => {
            const data = snapshot.val();
            if (data && data.enabled) {
                document.getElementById('maintenance-modal').style.display = 'flex';
                document.body.style.overflow = 'hidden';
            }
        });
    }

    // Function to initialize typing animation
    function initTypingAnimation() {
        const welcomeText = document.getElementById('welcome-text');
        if (!welcomeText) return;

        const messages = [
            "Olá, seja bem-vindo!",
            "Hello, welcome!",
            "Hola, bienvenido!",
            "Bonjour, bienvenue!"
        ];
        
        let messageIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        
        function type() {
            const currentMessage = messages[messageIndex];
            
            if (isDeleting) {
                welcomeText.textContent = currentMessage.substring(0, charIndex - 1);
                charIndex--;
            } else {
                welcomeText.textContent = currentMessage.substring(0, charIndex + 1);
                charIndex++;
            }
            
            let typeSpeed = isDeleting ? 50 : 100;
            
            if (!isDeleting && charIndex === currentMessage.length) {
                isDeleting = true;
                typeSpeed = 1000;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                messageIndex = (messageIndex + 1) % messages.length;
                typeSpeed = 500;
            }
            
            setTimeout(type, typeSpeed);
        }
        
        setTimeout(type, 1000);
    }

    // Function to load designs from Firebase
    function loadDesigns() {
        const designsContainer = document.getElementById('designs-container');
        if (!designsContainer) return;

        const designsRef = ref(database, 'designs');
        onValue(designsRef, (snapshot) => {
            const designs = snapshot.val();
            designsContainer.innerHTML = '';
            
            if (designs) {
                Object.keys(designs).forEach(key => {
                    const design = designs[key];
                    const designItem = document.createElement('div');
                    designItem.className = 'design-item';
                    designItem.setAttribute('data-category', design.category);
                    
                    designItem.innerHTML = `
                        <img src="${design.image}" alt="${design.title}">
                        <div class="design-overlay">
                            <h3 class="design-title">${design.title}</h3>
                            <p class="design-category">${design.category}</p>
                        </div>
                    `;
                    
                    designsContainer.appendChild(designItem);
                });
                
                // Initialize filter functionality
                initDesignFilters();
            } else {
                designsContainer.innerHTML = '<p class="text-center">Nenhum design encontrado.</p>';
            }
        });
    }

    // Function to initialize design filters
    function initDesignFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                // Get filter value
                const filterValue = this.getAttribute('data-filter');
                
                // Filter designs
                const designItems = document.querySelectorAll('.design-item');
                
                designItems.forEach(item => {
                    if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }

    // Function to load ads from Firebase
    function loadAds() {
        const adContent = document.getElementById('ad-content');
        if (!adContent) return;

        const adsRef = ref(database, 'ads');
        onValue(adsRef, (snapshot) => {
            const ads = snapshot.val();
            adContent.innerHTML = '';
            
            if (ads) {
                Object.keys(ads).forEach(key => {
                    const ad = ads[key];
                    if (ad.active) {
                        const adItem = document.createElement('div');
                        adItem.className = 'ad-item';
                        
                        if (ad.type === 'image') {
                            adItem.innerHTML = `<img src="${ad.content}" alt="Anúncio" style="max-width: 100%;">`;
                        } else {
                            adItem.innerHTML = ad.content;
                        }
                        
                        adContent.appendChild(adItem);
                    }
                });
            } else {
                adContent.innerHTML = '<p>Espaço disponível para anúncios</p>';
            }
        });
    }

    // Function to initialize mobile menu
    function initMobileMenu() {
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const nav = document.querySelector('nav');
        
        if (mobileMenuBtn && nav) {
            mobileMenuBtn.addEventListener('click', function() {
                nav.classList.toggle('active');
            });
        }
    }

    // Function to initialize smooth scrolling
    function initSmoothScrolling() {
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    // Close mobile menu if open
                    const nav = document.querySelector('nav');
                    if (nav.classList.contains('active')) {
                        nav.classList.remove('active');
                    }
                    
                    // Scroll to section
                    window.scrollTo({
                        top: targetSection.offsetTop - 80,
                        behavior: 'smooth'
                    });
                    
                    // Update active link
                    navLinks.forEach(navLink => navLink.classList.remove('active'));
                    this.classList.add('active');
                }
            });
        });
    }

    // Function to initialize skill animations
    function initSkillAnimations() {
        const skillProgresses = document.querySelectorAll('.skill-progress');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const width = entry.target.getAttribute('data-width');
                    entry.target.style.width = width;
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        skillProgresses.forEach(progress => {
            observer.observe(progress);
        });
    }

    // Function to initialize contact form
    function initContactForm() {
        const contactForm = document.getElementById('contact-form');
        if (!contactForm) return;

        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('contact-name').value;
            const email = document.getElementById('contact-email').value;
            const subject = document.getElementById('contact-subject').value;
            const message = document.getElementById('contact-message').value;
            
            // Save contact form data to Firebase
            const contactsRef = ref(database, 'contacts');
            const newContactRef = push(contactsRef);
            
            set(newContactRef, {
                name: name,
                email: email,
                subject: subject,
                message: message,
                timestamp: new Date().toISOString(),
                read: false
            }).then(() => {
                alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
                contactForm.reset();
            }).catch((error) => {
                console.error('Erro ao enviar mensagem:', error);
                alert('Erro ao enviar mensagem. Tente novamente.');
            });
        });
    }

    // Function to initialize login form
    function initLoginForm() {
        const loginForm = document.getElementById('login-form');
        const googleLoginBtn = document.getElementById('google-login');
        const forgotPasswordBtn = document.getElementById('forgot-password');

        // Email/password login
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            
            signInWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    // Signed in
                    const user = userCredential.user;
                    window.location.href = 'admin.html';
                })
                .catch((error) => {
                    console.error('Erro no login:', error);
                    alert('Erro no login: ' + error.message);
                });
        });

        // Google login
        if (googleLoginBtn) {
            googleLoginBtn.addEventListener('click', function() {
                const provider = new GoogleAuthProvider();
                
                signInWithPopup(auth, provider)
                    .then((result) => {
                        // Signed in
                        const user = result.user;
                        window.location.href = 'admin.html';
                    }).catch((error) => {
                        console.error('Erro no login com Google:', error);
                        alert('Erro no login com Google: ' + error.message);
                    });
            });
        }

        // Forgot password
        if (forgotPasswordBtn) {
            forgotPasswordBtn.addEventListener('click', function() {
                const email = prompt('Por favor, digite seu e-mail para redefinir a senha:');
                
                if (email) {
                    sendPasswordResetEmail(auth, email)
                        .then(() => {
                            alert('E-mail de redefinição de senha enviado. Verifique sua caixa de entrada.');
                        })
                        .catch((error) => {
                            console.error('Erro ao enviar e-mail de redefinição:', error);
                            alert('Erro: ' + error.message);
                        });
                }
            });
        }
    }

    // Function to initialize admin dashboard
    function initAdminDashboard() {
        // Check if user is authenticated
        auth.onAuthStateChanged((user) => {
            if (!user) {
                window.location.href = 'login.html';
                return;
            }
            
            // Load admin data
            loadAdminStats();
            loadContacts();
            loadDesignsForAdmin();
            loadAdsForAdmin();
            initMaintenanceToggle();
            initDesignForm();
            initAdForm();
        });

        // Logout functionality
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', function() {
                auth.signOut().then(() => {
                    window.location.href = 'index.html';
                }).catch((error) => {
                    console.error('Erro ao fazer logout:', error);
                });
            });
        }
    }

    // Function to load admin stats
    function loadAdminStats() {
        const contactsRef = ref(database, 'contacts');
        const designsRef = ref(database, 'designs');
        const adsRef = ref(database, 'ads');
        
        // Count contacts
        onValue(contactsRef, (snapshot) => {
            const contacts = snapshot.val();
            const contactsCount = contacts ? Object.keys(contacts).length : 0;
            document.getElementById('contacts-count').textContent = contactsCount;
        });
        
        // Count designs
        onValue(designsRef, (snapshot) => {
            const designs = snapshot.val();
            const designsCount = designs ? Object.keys(designs).length : 0;
            document.getElementById('designs-count').textContent = designsCount;
        });
        
        // Count active ads
        onValue(adsRef, (snapshot) => {
            const ads = snapshot.val();
            let activeAdsCount = 0;
            
            if (ads) {
                Object.keys(ads).forEach(key => {
                    if (ads[key].active) {
                        activeAdsCount++;
                    }
                });
            }
            
            document.getElementById('ads-count').textContent = activeAdsCount;
        });
    }

    // Function to load contacts for admin
    function loadContacts() {
        const contactsRef = ref(database, 'contacts');
        const contactsTable = document.getElementById('contacts-table');
        
        if (!contactsTable) return;
        
        onValue(contactsRef, (snapshot) => {
            const contacts = snapshot.val();
            let tableHTML = '';
            
            if (contacts) {
                Object.keys(contacts).forEach(key => {
                    const contact = contacts[key];
                    const date = new Date(contact.timestamp).toLocaleDateString('pt-BR');
                    const readClass = contact.read ? '' : 'font-weight-bold';
                    
                    tableHTML += `
                        <tr>
                            <td class="${readClass}">${contact.name}</td>
                            <td class="${readClass}">${contact.email}</td>
                            <td class="${readClass}">${contact.subject}</td>
                            <td class="${readClass}">${date}</td>
                            <td class="actions">
                                <button class="btn btn-sm btn-primary view-contact" data-id="${key}">Ver</button>
                                <button class="btn btn-sm btn-danger delete-contact" data-id="${key}">Excluir</button>
                            </td>
                        </tr>
                    `;
                });
            } else {
                tableHTML = '<tr><td colspan="5" class="text-center">Nenhuma mensagem encontrada.</td></tr>';
            }
            
            contactsTable.innerHTML = tableHTML;
            
            // Add event listeners to view and delete buttons
            document.querySelectorAll('.view-contact').forEach(button => {
                button.addEventListener('click', function() {
                    const contactId = this.getAttribute('data-id');
                    viewContact(contactId);
                });
            });
            
            document.querySelectorAll('.delete-contact').forEach(button => {
                button.addEventListener('click', function() {
                    const contactId = this.getAttribute('data-id');
                    deleteContact(contactId);
                });
            });
        });
    }

    // Function to view contact message
    function viewContact(contactId) {
        const contactRef = ref(database, `contacts/${contactId}`);
        
        onValue(contactRef, (snapshot) => {
            const contact = snapshot.val();
            
            // Mark as read
            update(contactRef, { read: true });
            
            // Show message in modal
            alert(`Nome: ${contact.name}\nEmail: ${contact.email}\nAssunto: ${contact.subject}\nMensagem: ${contact.message}`);
        }, { onlyOnce: true });
    }

    // Function to delete contact message
    function deleteContact(contactId) {
        if (confirm('Tem certeza que deseja excluir esta mensagem?')) {
            const contactRef = ref(database, `contacts/${contactId}`);
            remove(contactRef)
                .then(() => {
                    alert('Mensagem excluída com sucesso.');
                })
                .catch((error) => {
                    console.error('Erro ao excluir mensagem:', error);
                    alert('Erro ao excluir mensagem.');
                });
        }
    }

    // Function to delete contact message
    function deleteContact(contactId) {
        if (confirm('Tem certeza que deseja excluir esta mensagem?')) {
            const contactRef = ref(database, `contacts/${contactId}`);
            remove(contactRef)
                .then(() => {
                    alert('Mensagem excluída com sucesso.');
                })
                .catch((error) => {
                    console.error('Erro ao excluir mensagem:', error);
                    alert('Erro ao excluir mensagem.');
                });
        }
    }

    // Function to load designs for admin
    function loadDesignsForAdmin() {
        const designsRef = ref(database, 'designs');
        const designsTable = document.getElementById('designs-table');
        
        if (!designsTable) return;
        
        onValue(designsRef, (snapshot) => {
            const designs = snapshot.val();
            let tableHTML = '';
            
            if (designs) {
                Object.keys(designs).forEach(key => {
                    const design = designs[key];
                    
                    tableHTML += `
                        <tr>
                            <td><img src="${design.image}" alt="${design.title}" style="width: 80px; height: 60px; object-fit: cover;"></td>
                            <td>${design.title}</td>
                            <td>${design.category}</td>
                            <td class="actions">
                                <button class="btn btn-sm btn-danger delete-design" data-id="${key}">Excluir</button>
                            </td>
                        </tr>
                    `;
                });
            } else {
                tableHTML = '<tr><td colspan="4" class="text-center">Nenhum design encontrado.</td></tr>';
            }
            
            designsTable.innerHTML = tableHTML;
            
            // Add event listeners to delete buttons
            document.querySelectorAll('.delete-design').forEach(button => {
                button.addEventListener('click', function() {
                    const designId = this.getAttribute('data-id');
                    deleteDesign(designId);
                });
            });
        });
    }

    // Function to delete design
    function deleteDesign(designId) {
        if (confirm('Tem certeza que deseja excluir este design?')) {
            const designRef = ref(database, `designs/${designId}`);
            remove(designRef)
                .then(() => {
                    alert('Design excluído com sucesso.');
                })
                .catch((error) => {
                    console.error('Erro ao excluir design:', error);
                    alert('Erro ao excluir design.');
                });
        }
    }

    // Function to load ads for admin
    function loadAdsForAdmin() {
        const adsRef = ref(database, 'ads');
        const adsTable = document.getElementById('ads-table');
        
        if (!adsTable) return;
        
        onValue(adsRef, (snapshot) => {
            const ads = snapshot.val();
            let tableHTML = '';
            
            if (ads) {
                Object.keys(ads).forEach(key => {
                    const ad = ads[key];
                    
                    tableHTML += `
                        <tr>
                            <td>${ad.title}</td>
                            <td>${ad.type}</td>
                            <td>${ad.active ? 'Ativo' : 'Inativo'}</td>
                            <td class="actions">
                                <button class="btn btn-sm btn-primary toggle-ad" data-id="${key}" data-active="${ad.active}">${ad.active ? 'Desativar' : 'Ativar'}</button>
                                <button class="btn btn-sm btn-danger delete-ad" data-id="${key}">Excluir</button>
                            </td>
                        </tr>
                    `;
                });
            } else {
                tableHTML = '<tr><td colspan="4" class="text-center">Nenhum anúncio encontrado.</td></tr>';
            }
            
            adsTable.innerHTML = tableHTML;
            
            // Add event listeners to toggle and delete buttons
            document.querySelectorAll('.toggle-ad').forEach(button => {
                button.addEventListener('click', function() {
                    const adId = this.getAttribute('data-id');
                    const currentActive = this.getAttribute('data-active') === 'true';
                    toggleAd(adId, !currentActive);
                });
            });
            
            document.querySelectorAll('.delete-ad').forEach(button => {
                button.addEventListener('click', function() {
                    const adId = this.getAttribute('data-id');
                    deleteAd(adId);
                });
            });
        });
    }

    // Function to toggle ad status
    function toggleAd(adId, active) {
        const adRef = ref(database, `ads/${adId}`);
        
        update(adRef, { active: active })
            .then(() => {
                alert(`Anúncio ${active ? 'ativado' : 'desativado'} com sucesso.`);
            })
            .catch((error) => {
                console.error('Erro ao alterar status do anúncio:', error);
                alert('Erro ao alterar status do anúncio.');
            });
    }

    // Function to delete ad
    function deleteAd(adId) {
        if (confirm('Tem certeza que deseja excluir este anúncio?')) {
            const adRef = ref(database, `ads/${adId}`);
            remove(adRef)
                .then(() => {
                    alert('Anúncio excluído com sucesso.');
                })
                .catch((error) => {
                    console.error('Erro ao excluir anúncio:', error);
                    alert('Erro ao excluir anúncio.');
                });
        }
    }

    // Function to initialize maintenance toggle
    function initMaintenanceToggle() {
        const maintenanceToggle = document.getElementById('maintenance-toggle');
        if (!maintenanceToggle) return;

        const maintenanceRef = ref(database, 'maintenance');
        
        // Get current maintenance status
        onValue(maintenanceRef, (snapshot) => {
            const maintenance = snapshot.val();
            if (maintenance) {
                maintenanceToggle.checked = maintenance.enabled;
                document.getElementById('maintenance-message').value = maintenance.message || '';
            }
        });
        
        // Update maintenance status when toggle changes
        maintenanceToggle.addEventListener('change', function() {
            const enabled = this.checked;
            const message = document.getElementById('maintenance-message').value;
            
            set(maintenanceRef, { enabled, message })
                .then(() => {
                    alert(`Modo de manutenção ${enabled ? 'ativado' : 'desativado'} com sucesso.`);
                })
                .catch((error) => {
                    console.error('Erro ao alterar modo de manutenção:', error);
                    alert('Erro ao alterar modo de manutenção.');
                });
        });
        
        // Update maintenance message
        const messageInput = document.getElementById('maintenance-message');
        messageInput.addEventListener('change', function() {
            const enabled = maintenanceToggle.checked;
            const message = this.value;
            
            set(maintenanceRef, { enabled, message })
                .catch((error) => {
                    console.error('Erro ao atualizar mensagem de manutenção:', error);
                });
        });
    }

    // Function to initialize design form
    function initDesignForm() {
        const designForm = document.getElementById('design-form');
        if (!designForm) return;

        designForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const title = document.getElementById('design-title').value;
            const category = document.getElementById('design-category').value;
            const imageFile = document.getElementById('design-image').files[0];
            
            if (!imageFile) {
                alert('Por favor, selecione uma imagem.');
                return;
            }
            
            // Convert image to Base64
            const reader = new FileReader();
            reader.readAsDataURL(imageFile);
            reader.onload = function() {
                const imageData = reader.result;
                
                // Save design to Firebase
                const designsRef = ref(database, 'designs');
                const newDesignRef = push(designsRef);
                
                set(newDesignRef, {
                    title: title,
                    category: category,
                    image: imageData,
                    timestamp: new Date().toISOString()
                }).then(() => {
                    alert('Design adicionado com sucesso!');
                    designForm.reset();
                }).catch((error) => {
                    console.error('Erro ao adicionar design:', error);
                    alert('Erro ao adicionar design.');
                });
            };
        });
    }

    // Function to initialize ad form
    function initAdForm() {
        const adForm = document.getElementById('ad-form');
        if (!adForm) return;

        adForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const title = document.getElementById('ad-title').value;
            const type = document.getElementById('ad-type').value;
            const content = document.getElementById('ad-content').value;
            const active = document.getElementById('ad-active').checked;
            
            // Save ad to Firebase
            const adsRef = ref(database, 'ads');
            const newAdRef = push(adsRef);
            
            set(newAdRef, {
                title: title,
                type: type,
                content: content,
                active: active,
                timestamp: new Date().toISOString()
            }).then(() => {
                alert('Anúncio adicionado com sucesso!');
                adForm.reset();
            }).catch((error) => {
                console.error('Erro ao adicionar anúncio:', error);
                alert('Erro ao adicionar anúncio.');
            });
        });
    }

    // Terms modal functionality
    const acceptTermsBtn = document.getElementById('accept-terms');
    const rejectTermsBtn = document.getElementById('reject-terms');
    
    if (acceptTermsBtn) {
        acceptTermsBtn.addEventListener('click', function() {
            localStorage.setItem('termsAccepted', 'true');
            document.getElementById('terms-modal').classList.remove('active');
        });
    }
    
    if (rejectTermsBtn) {
        rejectTermsBtn.addEventListener('click', function() {
            alert('Para usar este site, você precisa aceitar os termos de uso.');
        });
    }
});