/* 1. TYPING EFFECT */
const roles = [
    "a Software Engineering Student",
    "a Web Developer",
    "a Problem Solver"
];

const typedEl  = document.getElementById("typed-text"); // the <span> we type into
let roleIndex  = 0;   // which role we're currently typing
let charIndex  = 0;   // which character within the role we're at
let isDeleting = false; // are we currently deleting or typing?

function typeEffect() {
    const currentRole = roles[roleIndex];

    if (!isDeleting) {
        // TYPING: reveal one more char
        typedEl.textContent = currentRole.slice(0, charIndex + 1);
        charIndex++;

        if (charIndex === currentRole.length) {
            //finished typing — pause, then start deleting
            setTimeout(() => { isDeleting = true; typeEffect(); }, 1800);
            return;
        }
    } else {
        // DELETING: remove one char
        typedEl.textContent = currentRole.slice(0, charIndex - 1);
        charIndex--;

        if (charIndex === 0) {
            //finished deleting — move to next role
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
        }
    }
    //typing speed: deleting is slightly faster than typing
    const speed = isDeleting ? 60 : 100;
    setTimeout(typeEffect, speed);
}
//start the effect once the page loads
typeEffect();


/* 2. SCROLL REVEAL*/
const revealObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                // Once revealed, stop observing
                revealObserver.unobserve(entry.target);
            }
        });
    },
    {
        threshold: 0.12  // trigger when 12% of the element is visible
    }
);
// Observe every element with class "reveal"
document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));


/*3. HEADER SCROLL BEHAVIOUR*/
const header = document.getElementById("header");

window.addEventListener("scroll", () => {
    if (window.scrollY > 60) {
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
    }
});


/*4. MOBILE MENU - HAMBURGER TOGGLE*/
const menuIcon = document.getElementById("menu-icon");
const navlist  = document.getElementById("navlist");

menuIcon.addEventListener("click", () => {
    navlist.classList.toggle("open");
    // Swap hamburger <-> close icon
    menuIcon.classList.toggle("bx-menu");
    menuIcon.classList.toggle("bx-x");
});

navlist.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
        navlist.classList.remove("open");
        menuIcon.classList.add("bx-menu");
        menuIcon.classList.remove("bx-x");
    });
});


/*5. ACTIVE NAV LINK HIGHLIGHT*/
const sections  = document.querySelectorAll("section[id]");
const navLinks  = document.querySelectorAll(".nav-link");

const sectionObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Remove active from all links
                navLinks.forEach(link => link.classList.remove("active"));
                // Add active to the link pointing to this section
                const activeLink = document.querySelector(
                    `.nav-link[href="#${entry.target.id}"]`
                );
                if (activeLink) activeLink.classList.add("active");
            }
        });
    },
    {
        // rootMargin shifts the trigger point to roughly the middle of the screen
        rootMargin: "-40% 0px -55% 0px"
    }
);

sections.forEach(section => sectionObserver.observe(section));


/* 6. AUTO-FILL FOOTER YEAR */
document.getElementById("year").textContent = new Date().getFullYear();


/* 7. CONTACT FORM — CLIENT-SIDE FEEDBACK */
const FORMSPREE_URL = "https://formspree.io/f/xpqblljo";
   function handleContact() {
    const name    = document.getElementById("name").value.trim();
    const email   = document.getElementById("email").value.trim();
    const subject = document.getElementById("subject").value.trim();
    const message = document.getElementById("message").value.trim();
    const msgEl   = document.getElementById("form-msg");
    const btn     = document.getElementById("sendBtn");

    // Basic validation
    if (!name || !email || !message) {
        msgEl.style.color = "#e07080";
        msgEl.textContent = "Please fill in your name, email, and message.";
        return;
    }

    // Simple email format check
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        msgEl.style.color = "#e07080";
        msgEl.textContent = "Please enter a valid email address.";
        return;
    }

    btn.disabled = true;
    btn.textContent = "Sending…";

    if (!FORMSPREE_URL) {
        console.warn("Set FORMSPREE_URL in script.js to enable real email sending.");
    } else {
        fetch(FORMSPREE_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, subject, message })
        })
        .then(res => {
            if (res.ok) {
                showMsg(msgEl, "Message sent! I'll get back to you soon 🌸", "success");
                clearForm();
            } else {
                showMsg(msgEl, "Something went wrong. Try emailing me directly.", "error");
            }
        })
        .catch(() => {
            showMsg(msgEl, "Network error. Please try again.", "error");
        })
        .finally(() => {
            btn.disabled = false;
            btn.textContent = "Send Message";
        });
        return;
    }
    setTimeout(() => {
        showMsg(msgEl, "Message received! I'll get back to you soon 🌸", "success");
        clearForm();
        btn.disabled = false;
        btn.textContent = "Send Message";
    }, 1200);
}

function showMsg(el, text, type) {
    el.textContent = text;
    el.style.color = type === "error" ? "#e07080" : "var(--hover-color)";
}

function clearForm() {
    ["name", "email", "subject", "message"].forEach(id => {
        document.getElementById(id).value = "";
    });
}