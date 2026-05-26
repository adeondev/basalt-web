// --- Custom Hover Tooltip Logic ---
(function() {
  const tooltipWrapper = document.getElementById("preview-tooltip-wrapper");
  
  if (tooltipWrapper) {
    window.addEventListener("mousemove", (e) => {
      const x = e.clientX;
      const y = e.clientY;

      // Update position
      tooltipWrapper.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      
      // Since the mockup has pointer-events: none, we must use coordinate detection
      const mockup = document.querySelector('.mac-mockup-wrapper');
      if (mockup) {
        const rect = mockup.getBoundingClientRect();
        const isInside = (
          x >= rect.left && 
          x <= rect.right && 
          y >= rect.top && 
          y <= rect.bottom
        );
        
        if (isInside) {
          tooltipWrapper.classList.add("active");
        } else {
          tooltipWrapper.classList.remove("active");
        }
      }
    });

    // --- Ticker Scroll Acceleration (Smooth with Web Animations API) ---
    const tickerTrack = document.getElementById("ticker-track");
    let lastScrollTop = window.scrollY;
    
    // Get the active animation
    const tickerAnimation = tickerTrack ? tickerTrack.getAnimations()[0] : null;

    window.addEventListener("scroll", () => {
      if (!tickerAnimation) return;
      
      const currentScroll = window.scrollY;
      const scrollDelta = Math.abs(currentScroll - lastScrollTop);
      
      // Calculate playback rate boost
      // 1 is normal speed, 2 is double, etc.
      const speedBoost = Math.min(3, scrollDelta * 0.015);
      const newRate = 1 + speedBoost;
      
      tickerAnimation.updatePlaybackRate(newRate);
      
      // Return to normal speed (1) after scroll stops
      clearTimeout(tickerTrack.speedTimeout);
      tickerTrack.speedTimeout = setTimeout(() => {
        tickerAnimation.updatePlaybackRate(1);
      }, 150);

      lastScrollTop = currentScroll;
    });
  }
})();

(function () {
  const titleText = "Um novo jeito de guardar suas notas";
  const titleEl = document.querySelector(".intro-title-text");
  const cursorEl = document.querySelector(".type-cursor");
  const headerEl = document.querySelector(".intro-logo-header");
  const mainTitleEl = document.querySelector(".intro-title");

  let typeChar;
  if (titleEl) {

  // Pre-split and populate the DOM to establish static layout
  const words = titleText.split(" ");
  titleEl.innerHTML = "";

  const allCharElements = [];

  words.forEach((word, wordIdx) => {
    const wordSpan = document.createElement("span");
    wordSpan.className = "typed-word";

    for (let char of word) {
      const charSpan = document.createElement("span");
      charSpan.className = "typed-char";
      charSpan.textContent = char;
      wordSpan.appendChild(charSpan);
      allCharElements.push(charSpan);
    }

    titleEl.appendChild(wordSpan);

    if (wordIdx < words.length - 1) {
      const spaceSpan = document.createElement("span");
      spaceSpan.className = "typed-space";
      spaceSpan.textContent = " ";
      titleEl.appendChild(spaceSpan);
      allCharElements.push(spaceSpan);
    }
  });

  // Create floating Markdown asterisks that will dive into the text
  const containerEl = document.querySelector(".intro-container");

  const leftAsterisk = document.createElement("span");
  leftAsterisk.className = "md-asterisk md-left";
  leftAsterisk.setAttribute("aria-hidden", "true");
  leftAsterisk.textContent = "*";

  const rightAsterisk = document.createElement("span");
  rightAsterisk.className = "md-asterisk md-right";
  rightAsterisk.setAttribute("aria-hidden", "true");
  rightAsterisk.textContent = "*";

  if (mainTitleEl) {
    mainTitleEl.appendChild(leftAsterisk);
    mainTitleEl.appendChild(rightAsterisk);
  }

  // Ensure cursor is a direct child of mainTitleEl for absolute positioning
  if (cursorEl && mainTitleEl) {
    mainTitleEl.appendChild(cursorEl);
    cursorEl.style.opacity = "";
    cursorEl.style.transform = "";
    cursorEl.style.transition = "";
  }

  // Helper to position cursor absolutely relative to mainTitleEl
  function positionCursor(targetEl, alignToRight = true) {
    if (!cursorEl || !targetEl || !mainTitleEl) return;

    const targetRect = targetEl.getBoundingClientRect();
    const containerRect = mainTitleEl.getBoundingClientRect();

    const x = alignToRight ? (targetRect.right - containerRect.left) : (targetRect.left - containerRect.left);
    const y = targetRect.top - containerRect.top;

    cursorEl.style.transform = `translate(${x}px, ${y}px)`;
    cursorEl.style.height = `${targetRect.height}px`;
  }

  // Position cursor at the start of the first letter initially
  if (allCharElements.length > 0) {
    positionCursor(allCharElements[0], false);
  }

    let charIndex = 0;
    typeChar = function() {
      if (charIndex < allCharElements.length) {
        const charEl = allCharElements[charIndex];
        charEl.classList.add("popped");

        // Smoothly glide the cursor to the end of the current character
        positionCursor(charEl, true);

        charIndex++;
        // Type speed sweet spot: between 25ms and 55ms delay per character
        setTimeout(typeChar, 25 + Math.random() * 30);
      } else {
        onTypeFinish();
      }
    };

    function onTypeFinish() {
      // 1. Fade out the cursor smoothly
      if (cursorEl) {
        cursorEl.style.transition = "opacity 0.4s ease, transform 0.4s ease";
        cursorEl.style.animation = "none"; // Stop animation to allow opacity to fade out
        cursorEl.style.opacity = "0";
      }

      // 2. Pop in the asterisks (Markdown style) after a short delay
      setTimeout(() => {
        if (containerEl) {
          containerEl.classList.add("show-asterisks");
        }

        // 3. Trigger the high-velocity dive after a very short float
        setTimeout(() => {
          if (containerEl) {
            containerEl.classList.add("dive-asterisks");
          }

          // 4. Trigger the impact event (bolding + shockwave) at the exact moment of impact (200ms dive duration)
          setTimeout(() => {
            if (containerEl) {
              containerEl.classList.add("apply-markdown");
            }

            // 5. Trigger the logo header and buttons pop-in shortly after
            setTimeout(() => {
              if (headerEl) {
                headerEl.classList.add("show-header");
              }
              if (containerEl) {
                containerEl.classList.add("show-actions");
              }
            }, 200);
          }, 200); // 200ms dive animation duration
        }, 450); // 450ms of float state (150ms after appear finishes)
      }, 200);
    }
  }

  // OS Detection Helper
  function detectOS() {
    const userAgent = window.navigator.userAgent;
    const platform = window.navigator.platform || "";
    const macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'];
    const windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'];
    const iosPlatforms = ['iPhone', 'iPad', 'iPod'];

    if (macosPlatforms.indexOf(platform) !== -1) {
      return 'macOS';
    } else if (iosPlatforms.indexOf(platform) !== -1) {
      return 'iOS';
    } else if (windowsPlatforms.indexOf(platform) !== -1) {
      return 'Windows';
    } else if (/Android/.test(userAgent)) {
      return 'Android';
    } else if (/Linux/.test(platform) || /Linux/.test(userAgent)) {
      return 'Linux';
    }

    // Fallback regex detection
    if (/Windows/i.test(userAgent)) return 'Windows';
    if (/Macintosh/i.test(userAgent)) return 'macOS';
    if (/Linux/i.test(userAgent)) return 'Linux';
    if (/iPhone|iPad|iPod/i.test(userAgent)) return 'iOS';
    if (/Android/i.test(userAgent)) return 'Android';

    return '';
  }

  // Set download button text and dynamic SVG icon based on user platform
  const osName = detectOS();
  const downloadBtn = document.querySelector("#btn-download");
  if (downloadBtn) {
    let iconSvg = "";
    let buttonText = "Baixar App";

    if (osName === "Windows") {
      iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 88 88" class="btn-icon"><path d="M0 12.402l35.687-4.86.016 34.423-35.67.203zm35.67 33.529l.028 34.453L.028 75.48.026 45.7zm4.326-39.025L87.314 0v41.527l-47.318.376zm47.329 39.349l-.011 41.34-47.318-6.678-.066-34.739z"/></svg>`;
      buttonText = "Baixar para Windows";
    } else if (osName === "macOS" || osName === "iOS") {
      iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 814 1000" class="btn-icon"><path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76.5 0-103.7 40.8-165.9 40.8s-105.6-57-155.5-127C46.7 790.7 0 663 0 541.8c0-194.4 126.4-297.5 250.8-297.5 66.1 0 121.2 43.4 162.7 43.4 39.5 0 101.1-46 176.3-46 28.5 0 130.9 2.6 198.3 99.2zm-234-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z"/></svg>`;
      buttonText = `Baixar para ${osName}`;
    } else if (osName === "Linux" || osName === "Android") {
      iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="btn-icon"><path d="M12 2a5 5 0 0 0-5 5c0 1.5 1 2.8 2.4 3.3C7 11.1 5.5 13.5 5.5 16.5c0 .3.2.5.5.5h12c.3 0 .5-.2.5-.5 0-3-1.5-5.4-3.9-6.2C16 9.8 17 8.5 17 7a5 5 0 0 0-5-5zm0 1.5a3.5 3.5 0 0 1 3.5 3.5c0 1.5-1.1 2.8-2.6 3.3-.5.1-.9-.3-.9-.8V8c0-.6-.4-1-1-1s-1 .4-1 1v1.5c0 .5-.4.9-.9.8-1.5-.5-2.6-1.8-2.6-3.3a3.5 3.5 0 0 1 3.5-3.5zm-5 12c.3-2.1 1.9-3.7 4-3.9v1.4c-1.3.2-2.3 1.2-2.5 2.5H7zm10 0h-3c-.2-1.3-1.2-2.3-2.5-2.5v-1.4c2.1.2 3.7 1.9 4 3.9z"/></svg>`;
      buttonText = `Baixar para ${osName}`;
    }

    if (iconSvg) {
      downloadBtn.innerHTML = `${iconSvg}<span>${buttonText}</span>`;
    } else {
      downloadBtn.innerHTML = `<span>${buttonText}</span>`;
    }
  }

  // --- Use Cases "Ver mais" Logic ---
  const showMoreBtn = document.getElementById("btn-show-more-cases");
  const extraGallery = document.getElementById("extra-cases-gallery");
  
  if (showMoreBtn && extraGallery) {
    showMoreBtn.addEventListener("click", () => {
      extraGallery.classList.add("show");
      showMoreBtn.style.display = "none";
      
      // Initialize spotlight for newly shown cards
      const newCards = extraGallery.querySelectorAll(".use-case-vertical-card");
      newCards.forEach(card => initSpotlight(card));
    });
  }

  // --- Card Expansion Logic (Delegated) ---
  document.addEventListener("click", (e) => {
    const card = e.target.closest(".use-case-vertical-card");
    if (card) {
      const allCards = document.querySelectorAll(".use-case-vertical-card");
      allCards.forEach(c => c.classList.remove("active"));
      card.classList.add("active");
    }
  });

  // Re-usable spotlight init function
  window.initSpotlight = function initSpotlight(el) {
    // 1. Wrap existing content in a .btn-content span if it doesn't already have one
    let contentSpan = el.querySelector(".btn-content");
    if (!contentSpan) {
      contentSpan = document.createElement("span");
      contentSpan.className = "btn-content";
      while (el.firstChild) {
        contentSpan.appendChild(el.firstChild);
      }
      el.appendChild(contentSpan);
    }

    // 2. Create overlay container that mirrors the inner HTML
    const overlay = document.createElement("span");
    overlay.className = "btn-hover-overlay";
    overlay.setAttribute("aria-hidden", "true");
    overlay.innerHTML = `<span class="btn-content">${contentSpan.innerHTML}</span>`;
    el.appendChild(overlay);

    // 3. Update overlay if content changes dynamically
    const observer = new MutationObserver(() => {
      overlay.innerHTML = `<span class="btn-content">${contentSpan.innerHTML}</span>`;
    });
    observer.observe(contentSpan, { childList: true, characterData: true, subtree: true });

    el.addEventListener("mousemove", e => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      el.style.setProperty("--x", `${x}px`);
      el.style.setProperty("--y", `${y}px`);
    });
  }

  // Spotlight Hover Effect for Interactive Elements (Initial)
  const spotlightElements = document.querySelectorAll(".btn, .use-case-vertical-card, .faq-item");
  spotlightElements.forEach(el => initSpotlight(el));

  // Start the typewriter action after the initial wrapper pop/fade in
  if (titleEl) {
    setTimeout(typeChar, 800);
  }

  // Lightweight Smooth Scroll (cross-browser)
  let smoothTarget = window.scrollY;
  let smoothCurrent = window.scrollY;
  let smoothRunning = false;
  let interpolationFactor = 0.4;

  window.addEventListener("scroll", () => {
    if (!smoothRunning) {
      smoothTarget = window.scrollY;
      smoothCurrent = window.scrollY;
    }
  });

  window.addEventListener("wheel", (e) => {
    if (e.ctrlKey) return;
    e.preventDefault();

    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    smoothTarget = Math.max(0, Math.min(smoothTarget + e.deltaY, maxScroll));
    interpolationFactor = 0.4; // fast feedback for wheel scrolling

    if (!smoothRunning) {
      smoothRunning = true;
      requestAnimationFrame(tick);
    }
  }, { passive: false });

  function tick() {
    smoothCurrent += (smoothTarget - smoothCurrent) * interpolationFactor;

    if (Math.abs(smoothTarget - smoothCurrent) < 0.5) {
      smoothCurrent = smoothTarget;
      smoothRunning = false;
      interpolationFactor = 0.4; // reset to default
    }

    window.scrollTo(0, smoothCurrent);

    if (smoothRunning) requestAnimationFrame(tick);
  }

  // Intercept anchor clicks for smooth scroll navigation
  document.addEventListener("click", (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (link) {
      const targetId = link.getAttribute("href");
      if (targetId === "#") return;
      
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        
        const headerHeight = 80; // 60px header + 20px breathing margin
        const targetRect = targetEl.getBoundingClientRect();
        const absoluteTargetY = targetRect.top + window.scrollY;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        
        smoothTarget = Math.max(0, Math.min(absoluteTargetY - headerHeight, maxScroll));
        interpolationFactor = 0.08; // smooth, elegant ease-out for anchor click transitions
        
        if (!smoothRunning) {
          smoothRunning = true;
          requestAnimationFrame(tick);
        }
      }
    }
  });

  // --- Scroll-driven mockup expansion ---
  const previewSection = document.getElementById("interactive-preview");
  const mockupWrapper = document.querySelector(".mac-mockup-wrapper");
  
  // Use querySelector for previewContainer if we need it inside IIFE
  const previewContainer = document.querySelector(".interactive-preview-container");

  function updateScrollProgress() {
    if (!previewSection || !mockupWrapper) return;
    const rect = previewSection.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    // Expand starts when the top of the section enters the bottom of the viewport
    // and finishes when the section is near the center of the viewport
    const start = viewportHeight;
    const end = viewportHeight * 0.15;

    let progress = (start - rect.top) / (start - end);
    progress = Math.max(0, Math.min(1, progress));

    mockupWrapper.style.setProperty("--scroll-progress", progress);
  }

  window.addEventListener("scroll", updateScrollProgress);
  window.addEventListener("resize", updateScrollProgress);
  updateScrollProgress();

  // --- Mockup Typing & Tab Loop ---
  const fakeMouse = document.getElementById("fake-mouse-pointer");
  const clickPulse = document.getElementById("click-pulse");
  const editorTextarea = document.getElementById("mockup-editor-textarea");
  const editTab = document.getElementById("mac-tab-edit");
  const previewTab = document.getElementById("mac-tab-preview");
  const editorPanel = document.getElementById("editor-panel");
  const previewPanel = document.getElementById("preview-panel");
  const lineStatus = document.getElementById("mockup-line-status");
  const lineNumbersGutter = document.querySelector(".editor-line-numbers");

  const noteText = `# Curiosidades sobre a Lava 🌋\n\nA lava é rocha fundida expelida por um vulcão durante uma erupção.\n\nQuando ela resfria, transforma-se em diferentes tipos de pedras vulcânicas.\n\n**Fatos vulcânicos:**\n- O resfriamento rápido da lava rica em sílica cria a **Obsidiana**\n- O **Basalto** é a rocha formada pelo resfriamento de lavas fluidas\n- O basalto compõe a maior parte do fundo oceânico da Terra\n- A obsidiana era usada na antiguidade para criar ferramentas afiadas\n\nÉ incrível como o calor extremo da terra cria materiais tão sólidos.\n\nEstes minerais são fundamentais para a nossa geologia e para o Basalt.\n\nA lava pode atingir temperaturas superiores a 1.200 graus Celsius.\n\nCada nota aqui é como uma pedra: sólida, duradoura e única.`;

  const linesArray = noteText.split("\n");
  const noteLineCount = linesArray.length;

  // Initialize Line Numbers Gutter
  if (lineNumbersGutter) {
    lineNumbersGutter.innerHTML = Array.from({length: noteLineCount}, (_, i) => `<span>${i+1}</span>`).join('');
  }

  function escapeHTML(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function highlightMarkdown(text, cursorHtml) {
    function formatInline(t) {
      return escapeHTML(t)
        .replace(/\*\*(.*?)\*\*/g, '<span class="hl-bold">**$1**</span>')
        .replace(/\*(.*?)\*/g, '<span class="hl-italic">*$1*</span>');
    }

    const lines = text.split("\n");
    return lines.map((line, idx) => {
      const isLastLine = (idx === lines.length - 1);
      const suffix = isLastLine ? cursorHtml : "";

      if (line.startsWith("# ")) {
        return `<span class="hl-h1"><span class="hl-md-char">#</span> ${formatInline(line.slice(2))}${suffix}</span>`;
      }
      if (line.startsWith("- [ ] ") || line.startsWith("- [x] ")) {
        const isChecked = line.startsWith("- [x] ");
        const checkboxText = isChecked ? "[x]" : "[ ]";
        return `<span class="hl-list"><span class="hl-md-char">-</span> <span class="hl-checkbox">${checkboxText}</span> ${formatInline(line.slice(6))}${suffix}</span>`;
      }
      if (line.startsWith("- ")) {
        return `<span class="hl-list"><span class="hl-md-char">-</span> ${formatInline(line.slice(2))}${suffix}</span>`;
      }
      if (line.startsWith("> ")) {
        return `<span class="hl-quote"><span class="hl-md-char">&gt;</span> ${formatInline(line.slice(2))}${suffix}</span>`;
      }
      return `<span class="hl-line">${formatInline(line) || "​"}${suffix}</span>`;
    }).join("");
  }

  function triggerClickPulse() {
    if (!clickPulse) return;
    clickPulse.classList.remove("pulsing");
    void clickPulse.offsetWidth; // trigger reflow
    clickPulse.classList.add("pulsing");
  }

  function moveMouseTo(element, align, callback) {
    if (typeof align === "function") {
      callback = align;
      align = "center";
    }
    if (!fakeMouse || !element || !previewContainer) return;
    const targetRect = element.getBoundingClientRect();
    const containerRect = previewContainer.getBoundingClientRect();

    let x, y;
    if (align === "top-left") {
      // Align to top-left where typing starts (with padding matching the editor layout)
      x = (targetRect.left + 20) - containerRect.left;
      y = (targetRect.top + 22) - containerRect.top;
    } else {
      // Center of element
      x = (targetRect.left + targetRect.width / 2) - containerRect.left;
      y = (targetRect.top + targetRect.height / 2) - containerRect.top;
    }

    // Offset coordinates by 8px because the hotspot (tip) of this Wikimedia mouse pointer is at (8, 8)
    fakeMouse.style.left = `${x - 8}px`;
    fakeMouse.style.top = `${y - 8}px`;

    setTimeout(callback, 850);
  }

  let typingTimeout = null;

  function typeText(currentIndex, callback) {
    if (currentIndex <= noteText.length) {
      const currentSub = noteText.slice(0, currentIndex);
      const cursorHtml = '<span class="mockup-text-cursor blinking"></span>';
      editorTextarea.innerHTML = highlightMarkdown(currentSub, cursorHtml);
      if (lineStatus) {
        const currentLine = Math.max(1, currentSub.split("\n").length);
        lineStatus.textContent = `Linha ${currentLine}/${noteLineCount}`;
      }

      // Delay character-by-character
      let delay = 35 + Math.random() * 45;
      if (noteText[currentIndex - 1] === "\n") {
        delay = 250; // pause longer on newlines
      } else if (noteText[currentIndex - 1] === ".") {
        delay = 400; // pause longer on periods
      }

      typingTimeout = setTimeout(() => typeText(currentIndex + 1, callback), delay);
    } else {
      callback();
    }
  }

  function runAnimationLoop() {
    // Reset state
    clearTimeout(typingTimeout);
    editorTextarea.innerHTML = '<span class="mockup-text-cursor blinking"></span>';
    if (lineStatus) {
      lineStatus.textContent = `Linha 1/${noteLineCount}`;
    }

    // Switch to edit panel
    editTab.classList.add("active");
    previewTab.classList.remove("active");
    editorPanel.classList.add("active");
    previewPanel.classList.remove("active");

    // Position mouse initially at some lower right spot
    if (fakeMouse) {
      fakeMouse.style.left = "80%";
      fakeMouse.style.top = "80%";
    }

    setTimeout(() => {
      // 1. Move to editor textarea top-left to start typing
      moveMouseTo(editorTextarea, "top-left", () => {
        triggerClickPulse();

        // Start typing
        setTimeout(() => {
          typeText(1, () => {
            // Typing finished. Wait 1.5s
            setTimeout(() => {
              // 2. Move to preview tab
              moveMouseTo(previewTab, () => {
                triggerClickPulse();

                // Switch to preview mode
                setTimeout(() => {
                  editTab.classList.remove("active");
                  previewTab.classList.add("active");
                  editorPanel.classList.remove("active");
                  previewPanel.classList.add("active");

                  // Wait 4.5s on Preview, then loop
                  setTimeout(() => {
                    // 3. Move back to edit tab to restart
                    moveMouseTo(editTab, () => {
                      triggerClickPulse();
                      setTimeout(runAnimationLoop, 500);
                    });
                  }, 4500);
                }, 150);
              });
            }, 1200);
          });
        }, 300);
      });
    }, 1000);
  }

  // Start the mockup loop once loaded
  if (editTab && previewTab) {
    runAnimationLoop();
  }

  // --- FAQ Accordion Logic (Single Open with smooth transition) ---
  const faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach(item => {
    item.addEventListener("click", () => {
      const isActive = item.classList.contains("active");
      
      // Close all others
      faqItems.forEach(other => {
        if (other !== item) {
          other.classList.remove("active");
        }
      });

      // Toggle current
      item.classList.toggle("active");
    });
  });
})();
