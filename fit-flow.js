
import { auth, db } from './firestore.js';
import { doc, getDoc, collection, query, orderBy, limit, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const AI_FIT_URL = "ai-fit.html";

/**
 * Custom Fit Flow Logic
 */
export const initCustomFit = () => {
    console.log("🎯 initCustomFit initialized");
    const customFitBtn = document.querySelector('.find-my-size-btn');
    if (!customFitBtn) {
        console.warn("⚠️ Custom Fit button not found on this page.");
        return;
    }

    // Create Modal HTML and append to body if it doesn't exist
    if (!document.getElementById('fitModalOverlay')) {
        const modalHTML = `
            <div class="modal-overlay" id="fitModalOverlay">
                <div class="fit-modal">
                    <button class="modal-close" id="closeFitModal">
                        <span class="material-symbols-outlined">close</span>
                    </button>
                    <div id="modalContent">
                        <!-- Dynamic Content Loaded Here -->
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    if (!document.getElementById('cfm-modern-styles')) {
        const style = document.createElement('style');
        style.id = 'cfm-modern-styles';
        style.textContent = `
            .custom-fit-modal-modern { font-family: 'Inter', sans-serif; background: #fff; padding: 0; width: 100%; color: #0f172a; }
            .cfm-header { margin-bottom: 10px; display: flex; align-items: center; justify-content: flex-start; }
            .cfm-profile-select { appearance: none; background: #fff url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='none' stroke='%23333' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M4 6l4 4 4-4'/%3E%3C/svg%3E") no-repeat right 12px center; border: 1px solid #e2e8f0; border-radius: 8px; padding: 8px 36px 8px 12px; font-size: 14px; font-weight: 600; color: #0f172a; cursor: pointer; outline: none; transition: border-color 0.2s; }
            .cfm-profile-select:focus { border-color: #154cbd; }

            .cfm-odd-banner { background: #eff6ff; border: 1px solid #dbeafe; border-radius: 10px; padding: 9px 12px; margin-bottom: 10px; display: flex; align-items: center; gap: 10px; text-align: left; }
            .cfm-banner-icon-bg { width: 24px; height: 24px; background: #154cbd; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #ffffff; flex-shrink: 0; }
            .cfm-banner-i { font-size: 14px !important; }
            .cfm-banner-content { font-size: 12px; font-weight: 500; color: #1d4ed8; line-height: 1.4; }

            .cfm-table-container { border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden; margin-bottom: 10px; }
            .cfm-table { width: 100%; border-collapse: collapse; background: #fff; }
            .cfm-table th, .cfm-table td { padding: 10px 8px; border-bottom: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; }
            .cfm-table tr:last-child td { border-bottom: none; }
            .cfm-table th:last-child, .cfm-table td:last-child { border-right: none; }
            .cfm-table th { background: #fff; font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; text-align: center; }
            .cfm-table th:first-child { text-align: left; }
            .cfm-table th.cfm-custom-th { color: #154cbd; }
            .cfm-measurement-name { font-size: 11px; font-weight: 800; color: #0f172a; text-transform: uppercase; letter-spacing: 0.3px; }
            .cfm-measurement-desc { font-size: 10px; color: #64748b; margin-top: 1px; }
            .cfm-size-val { font-size: 20px; font-weight: 800; color: #0f172a; line-height: 1.1; }
            .cfm-size-unit { font-size: 10px; color: #64748b; margin-top: 1px; }

            .cfm-odd-info { font-size: 10px; color: #64748b; margin-top: 4px; font-weight: 500; }
            .cfm-badge { background: #dbeafe; color: #1d4ed8; font-size: 11px; font-weight: 700; padding: 1px 6px; border-radius: 5px; display: inline-block; }
            .cfm-odd-subinfo { font-size: 10px; color: #64748b; margin-top: 1px; }

            .cfm-custom-select { appearance: none; background: #fff url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' fill='none' stroke='%23333' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M4 6l4 4 4-4'/%3E%3C/svg%3E") no-repeat right 8px center; border: 1px solid #cbd5e1; border-radius: 7px; padding: 8px 26px 8px 10px; font-size: 16px; font-weight: 700; color: #0f172a; cursor: pointer; outline: none; width: 86px; text-align: center; box-sizing: border-box; transition: all 0.2s; }
            .cfm-custom-select:focus { border-color: #154cbd; }

            .cfm-actions { display: flex; gap: 10px; margin-bottom: 10px; }
            .cfm-btn { flex: 1; display: flex; align-items: center; justify-content: center; gap: 6px; padding: 10px 12px; border-radius: 8px; font-size: 12px; font-weight: 700; letter-spacing: 0.4px; cursor: pointer; transition: all 0.2s; text-decoration: none; border: none; }
            .cfm-btn-outline { background: #fff; border: 1.5px solid #154cbd; color: #154cbd; }
            .cfm-btn-outline:hover { background: #eff6ff; }

            .cfm-price-card { border: 1px solid #e2e8f0; border-radius: 10px; padding: 10px 14px; display: flex; align-items: center; margin-bottom: 10px; background: #fff; }
            .cfm-price-left { display: flex; flex-direction: column; text-align: left; }
            .cfm-price-label { font-size: 9px; font-weight: 700; color: #64748b; letter-spacing: 0.5px; text-transform: uppercase; }
            .cfm-price-val { font-size: 20px; font-weight: 800; color: #0f172a; line-height: 1.1; margin-top: 2px; }
            .cfm-price-divider { width: 1px; height: 30px; background: #e2e8f0; margin: 0 14px; flex-shrink: 0; }
            .cfm-price-right { font-size: 11px; font-weight: 500; color: #475569; line-height: 1.4; text-align: left; }

            .cfm-btn-primary-buy { width: 100%; background: #154cbd; color: #fff; padding: 13px; border-radius: 10px; font-size: 15px; font-weight: 700; letter-spacing: 0.5px; display: flex; align-items: center; justify-content: center; gap: 8px; cursor: pointer; border: none; transition: background 0.2s; box-sizing: border-box; }
            .cfm-btn-primary-buy:hover { background: #0e368b; }

            .cfm-input-group { margin-bottom: 14px; }
            .cfm-input-label { font-size: 11px; font-weight: 600; color: #64748b; margin-bottom: 6px; display: block; text-align: left; text-transform: uppercase; letter-spacing: 0.5px; }
            .cfm-input { width: 100%; box-sizing: border-box; padding: 11px 14px; border: 1px solid #e2e8f0; border-radius: 8px; font-family: 'Inter', sans-serif; font-size: 14px; color: #0f172a; background: #f8fafc; transition: all 0.2s; }
            .cfm-input:focus { outline: none; border-color: #154cbd; background: #fff; box-shadow: 0 0 0 3px rgba(21, 76, 189, 0.12); }
            .cfm-input::placeholder { color: #94a3b8; font-weight: 400; }
            .cfm-circle-icon { width: 60px; height: 60px; border-radius: 50%; background: #eef2ff; color: #154cbd; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; box-shadow: 0 4px 12px rgba(21,76,189,0.1); }

            .cfm-icon { font-size: 16px; }
        `;
        document.head.appendChild(style);
    }

    const overlay = document.getElementById('fitModalOverlay');
    const closeBtn = document.getElementById('closeFitModal');
    const contentArea = document.getElementById('modalContent');

    const closeModal = () => {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    };

    const openModal = () => {
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal();
    });

    // --- SIZE CHART MODAL ---
    const sizeChartBtn = document.querySelector('.size-chart-link');
    if (sizeChartBtn) {
        sizeChartBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openModal();
            contentArea.innerHTML = `
                <h2>Slyte Size Chart</h2>
                <div style="overflow-x:auto;">
                    <table class="size-chart-table">
                        <thead>
                            <tr><th>Size</th><th>Waist</th><th>Inseam</th><th>Outseam</th><th>Ankle</th></tr>
                        </thead>
                        <tbody>
                            <tr><td>S</td><td>28-30"</td><td>29"</td><td>38"</td><td>12.5"</td></tr>
                            <tr><td>M</td><td>30-32"</td><td>29.5"</td><td>39"</td><td>13"</td></tr>
                            <tr><td>L</td><td>32-34"</td><td>30"</td><td>40"</td><td>13.5"</td></tr>
                            <tr><td>XL</td><td>34-36"</td><td>30.5"</td><td>41"</td><td>14"</td></tr>
                            <tr><td>XXL</td><td>36-38"</td><td>31"</td><td>42"</td><td>14.5"</td></tr>
                        </tbody>
                    </table>
                </div>
                <div class="modal-actions" style="margin-top:20px;">
                    <button class="modal-btn btn-secondary" onclick="document.getElementById('closeFitModal').click()">Close</button>
                </div>
            `;
        });
    }

    // ─── ALL HELPER FUNCTIONS DEFINED FIRST ───────────────────────────────

    const renderLoading = () => {
        contentArea.innerHTML = `
            <div class="loading-spinner">
                <div class="spinner"></div>
                <p>Fetching your fit details...</p>
            </div>
        `;
    };

    /**
     * Merge Firestore entries with existing localStorage entries.
     * Deduplicates by (name + waist + outseam) combo so local-only scans aren't lost.
     * Newest entries come first.
     */
    const mergeFitLists = (localList, firestoreList) => {
        const seen = new Set();
        const merged = [];
        // Local entries take priority (they are the freshest)
        const combined = [...localList, ...firestoreList];
        for (const item of combined) {
            const key = `${(item.name || '').toLowerCase()}_${item.waist}_${item.outseam}`;
            if (!seen.has(key)) {
                seen.add(key);
                merged.push(item);
            }
        }
        return merged;
    };

    // Sizing logic
    const SIZE_CHART = [
        { label: 'S', min: 28, max: 30 },
        { label: 'M', min: 30, max: 32 },
        { label: 'L', min: 32, max: 34 },
        { label: 'XL', min: 34, max: 36 },
        { label: 'XXL', min: 36, max: 38 }
    ];

    const getRecommendedSize = (waist) => {
        const w = parseFloat(waist);
        const match = SIZE_CHART.find(s => w >= s.min && w <= s.max);
        if (match) return match.label;
        if (w < 28) return 'XS';
        if (w > 38) return '3XL+';
        return 'Custom';
    };

    const highlightRecommendedSize = (userWaist) => {
        const sizeBtns = document.querySelectorAll('.size-box');
        let closestBtn = null;
        let minDiff = Infinity;

        sizeBtns.forEach(btn => {
            const sizeVal = parseFloat(btn.innerText);
            if (!isNaN(sizeVal)) {
                const diff = Math.abs(userWaist - sizeVal);
                if (diff < minDiff) {
                    minDiff = diff;
                    closestBtn = btn;
                }
            }
        });

        if (closestBtn && minDiff <= 2) {
            document.querySelectorAll('.size-box.recommended').forEach(el => el.classList.remove('recommended'));
            closestBtn.classList.add('recommended');
        }
    };

    const renderAddSizeOptions = () => {
        contentArea.innerHTML = `
            <div class="custom-fit-modal-modern">
                <div style="text-align:center; padding: 20px 0;">
                    <div class="cfm-circle-icon">
                        <span class="material-symbols-outlined" style="font-size: 36px;">straighten</span>
                    </div>
                    <h2 style="font-size:22px; font-weight:700; color:#0f172a; margin-bottom:12px;">Add Your Size</h2>
                    <p style="color:#64748b; font-size:14px; margin-bottom:32px; line-height:1.5;">Choose how you want to add your measurements so we can recommend your perfect fit.</p>
                    
                    <div style="display:flex; flex-direction:column; gap:16px; padding: 0 10px;">
                        <a href="${AI_FIT_URL}" class="cfm-btn cfm-btn-primary-buy" style="text-decoration:none;">
                            <span class="material-symbols-outlined cfm-icon">auto_awesome</span> FIND SIZE USING AI
                        </a>
                        <button class="cfm-btn cfm-btn-outline" id="cfmAddManuallyBtn">
                            <span class="material-symbols-outlined cfm-icon">edit</span> ADD SIZES MANUALLY
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('cfmAddManuallyBtn').addEventListener('click', () => {
            renderManualAddForm();
        });
    };

    const renderManualAddForm = (editIndex = null, currentList = []) => {
        const isEdit = editIndex !== null && currentList[editIndex];
        const editItem = isEdit ? currentList[editIndex] : {};

        contentArea.innerHTML = `
            <div class="custom-fit-modal-modern">
                <div style="display:flex; align-items:center; gap: 12px; margin-bottom: 24px;">
                    <button id="cfmBackBtn" style="background:none; border:none; cursor:pointer; color:#0f172a; padding:8px; display:flex; align-items:center; border-radius:8px; transition:background 0.2s;" onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background='none'">
                        <span class="material-symbols-outlined" style="font-size:20px;">arrow_back</span>
                    </button>
                    <h2 style="font-size:20px; font-weight:700; color:#0f172a; margin:0;">${isEdit ? 'Edit Sizes' : 'Add Manual Sizes'}</h2>
                </div>

                <div style="margin-bottom: 24px;">
                    <div class="cfm-input-group">
                        <label class="cfm-input-label">Name</label>
                        <input type="text" id="manualName" class="cfm-input" placeholder="Enter your name" value="${editItem.name || ''}">
                    </div>
                    <div class="cfm-input-group">
                        <label class="cfm-input-label">Waist (in)</label>
                        <input type="number" id="manualWaist" class="cfm-input" placeholder="Enter waist size" value="${editItem.waist || ''}">
                    </div>
                    <div class="cfm-input-group">
                        <label class="cfm-input-label">Length (in)</label>
                        <input type="number" id="manualInseam" class="cfm-input" placeholder="Enter total leg length" value="${editItem.outseam && editItem.outseam !== '-' ? editItem.outseam : (editItem.inseam || '')}">
                    </div>
                    <div class="cfm-input-group" style="margin-bottom:0;">
                        <label class="cfm-input-label">Ankle Opening (in) <span style="font-weight:400; text-transform:none;">- Optional</span></label>
                        <input type="number" id="manualAnkle" class="cfm-input" placeholder="Enter ankle opening" value="${editItem.ankle || ''}">
                    </div>
                </div>

                <div>
                    <button class="cfm-btn cfm-btn-primary-buy" id="cfmSaveManualBtn">
                        <span class="material-symbols-outlined cfm-icon">save</span> ${isEdit ? 'UPDATE SIZES' : 'SAVE SIZES'}
                    </button>
                </div>
            </div>
        `;

        document.getElementById('cfmBackBtn').addEventListener('click', () => {
            if (currentList.length > 0) {
                renderMeasurementsTable(currentList, editIndex || 0);
            } else {
                renderAddSizeOptions();
            }
        });

        document.getElementById('cfmSaveManualBtn').addEventListener('click', () => {
            const name = document.getElementById('manualName').value.trim() || 'User';
            const waist = document.getElementById('manualWaist').value;
            const inseam = document.getElementById('manualInseam').value;
            let ankle = document.getElementById('manualAnkle').value;

            if (!waist || !inseam) {
                alert('Please enter Waist and Length.');
                return;
            }
            if (!ankle) ankle = "7";

            const updatedEntry = {
                name: name,
                waist: parseFloat(waist),
                outseam: parseFloat(inseam),
                inseam: parseFloat(inseam),
                ankle: parseFloat(ankle),
                recommendedSize: getRecommendedSize(waist),
                saved_at: new Date().toISOString()
            };

            const existingLocal = JSON.parse(localStorage.getItem('slyteFitResult') || '[]');
            let localList = Array.isArray(existingLocal) ? existingLocal : (existingLocal ? [existingLocal] : []);

            if (isEdit) {
                localList[editIndex] = updatedEntry;
            } else {
                localList = mergeFitLists(localList, [updatedEntry]);
            }

            localStorage.setItem('slyteFitResult', JSON.stringify(localList));

            renderMeasurementsTable(localList, isEdit ? editIndex : 0);
        });
    };

    const renderMeasurementsTable = (dataList, defaultIndex = 0) => {
        let selectedIndex = defaultIndex;

        const renderView = () => {
            const data = dataList[selectedIndex] || {};
            const name = data.name || 'User';
            const waist = data.waist || 30;
            const outseam = data.outseam && data.outseam !== '-' ? data.outseam : (data.inseam || 26);
            const ankle = data.ankle || 7;

            const waistNum = parseFloat(waist);
            const isOddWaist = !isNaN(waistNum) && (Math.round(waistNum) % 2 !== 0);
            const targetEvenSize = isOddWaist ? Math.floor(waistNum) - (Math.floor(waistNum) % 2 === 0 ? 0 : 1) : waistNum;

            const optionsHtml = dataList.map((d, i) =>
                `<option value="${i}" ${i === selectedIndex ? 'selected' : ''}>${d.name || 'User'} (${d.waist}")</option>`
            ).join('');

            let ankleValue = parseFloat(ankle) || 7;

            // Parse base price and add ₹199 custom fit charge
            const rawPrice = document.querySelector('.p-price')?.innerText || "₹1,699";
            const baseNum = parseInt(rawPrice.replace(/[^\d]/g, '')) || 1699;
            const CUSTOM_FIT_CHARGE = 99;
            const totalNum = baseNum + CUSTOM_FIT_CHARGE;
            const totalDisplay = '₹' + totalNum.toLocaleString('en-IN');

            contentArea.innerHTML = `
                <div class="custom-fit-modal-modern">
                    <div class="cfm-header">
                        <select class="cfm-profile-select" id="cfmProfileSelect">
                            ${optionsHtml}
                        </select>
                    </div>

                    ${isOddWaist ? `
                        <div class="cfm-odd-banner">
                            <div class="cfm-banner-icon-bg">
                                <span class="material-symbols-outlined cfm-banner-i">info</span>
                            </div>
                            <div class="cfm-banner-content">
                                Odd waist size entered. We'll make it in the best fitting size with 2" flexible elastic waistband for extra comfort.
                            </div>
                        </div>
                    ` : ''}

                    <div class="cfm-table-container">
                        <table class="cfm-table">
                            <thead>
                                <tr>
                                    <th>MEASUREMENT</th>
                                    <th>YOUR SIZE</th>
                                    <th class="cfm-custom-th">CUSTOM FIT</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <div class="cfm-measurement-name">WAIST</div>
                                        <div class="cfm-measurement-desc">Around the waist</div>
                                    </td>
                                    <td style="text-align:center;">
                                        <div class="cfm-size-val">${waist}</div>
                                        <div class="cfm-size-unit">inches</div>
                                    </td>
                                    <td style="text-align:center;">
                                        <div class="cfm-size-val">${waist}</div>
                                        <div class="cfm-size-unit">inches</div>
                                        ${isOddWaist ? `
                                            <div class="cfm-odd-info">
                                                Will be made in <span class="cfm-badge">${targetEvenSize}</span>
                                            </div>
                                            <div class="cfm-odd-subinfo">with 2" elastic waist</div>
                                        ` : ''}
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div class="cfm-measurement-name">LENGTH</div>
                                        <div class="cfm-measurement-desc">Total leg length</div>
                                    </td>
                                    <td style="text-align:center;">
                                        <div class="cfm-size-val">${outseam}</div>
                                        <div class="cfm-size-unit">inches</div>
                                    </td>
                                    <td style="text-align:center;">
                                        <div class="cfm-size-val">${outseam}</div>
                                        <div class="cfm-size-unit">inches</div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div class="cfm-measurement-name">ANKLE OPENING</div>
                                        <div class="cfm-measurement-desc">Bottom leg opening</div>
                                    </td>
                                    <td style="text-align:center;">
                                        <div class="cfm-size-val">${ankle}</div>
                                        <div class="cfm-size-unit">inches</div>
                                    </td>
                                    <td style="text-align:center;">
                                        <select class="cfm-custom-select" id="cfmAnkleSelect">
                                            <option value="6.5" ${ankleValue === 6.5 ? 'selected' : ''}>6.5</option>
                                            <option value="7" ${ankleValue === 7 ? 'selected' : ''}>7</option>
                                            <option value="7.5" ${ankleValue === 7.5 ? 'selected' : ''}>7.5</option>
                                            <option value="8" ${ankleValue === 8 ? 'selected' : ''}>8</option>
                                            <option value="8.5" ${ankleValue === 8.5 ? 'selected' : ''}>8.5</option>
                                        </select>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div class="cfm-actions">
                        <button class="cfm-btn cfm-btn-outline" id="cfmAddSizeBtn">
                            <span class="material-symbols-outlined cfm-icon">add</span> ADD SIZE
                        </button>
                        <button class="cfm-btn cfm-btn-outline" id="cfmEditSizeBtn">
                            <span class="material-symbols-outlined cfm-icon">edit</span> EDIT SIZES
                        </button>
                    </div>

                    <div class="cfm-price-card">
                        <div class="cfm-price-left">
                            <div class="cfm-price-label">TOTAL PRICE</div>
                            <div class="cfm-price-val">${totalDisplay}</div>
                        </div>
                        <div class="cfm-price-divider"></div>
                        <div class="cfm-price-right">
                            <span style="font-size:13px; font-weight:700; color:#0f172a; display:block; margin-bottom:3px;">Custom made just for you.</span>
                            <span style="font-size:10px; font-weight:500; color:#64748b;">ⓘ Includes <strong style="color:#0f172a;">₹99</strong> Custom Fit</span>
                        </div>
                    </div>

                    <button class="cfm-btn cfm-btn-primary-buy" id="cfmBuyNowBtn">
                        <span class="material-symbols-outlined cfm-icon">shopping_bag</span> BUY NOW
                    </button>
                </div>
            `;

            document.getElementById('cfmProfileSelect').addEventListener('change', (e) => {
                selectedIndex = parseInt(e.target.value);
                renderView();
            });

            document.getElementById('cfmAddSizeBtn').addEventListener('click', renderAddSizeOptions);

            document.getElementById('cfmEditSizeBtn').addEventListener('click', () => {
                renderManualAddForm(selectedIndex, dataList);
            });

            document.getElementById('cfmBuyNowBtn').addEventListener('click', (e) => {
                const dataset = dataList[selectedIndex] || {};
                const selectedAnkle = document.getElementById('cfmAnkleSelect').value;

                const customFitData = {
                    waist: dataset.waist,
                    outseam: dataset.outseam || "-",
                    inseam: dataset.inseam,
                    ankle: selectedAnkle,
                    recommendedSize: dataset.recommendedSize || getRecommendedSize(dataset.waist)
                };

                const urlParams = new URLSearchParams(window.location.search);
                const pid = parseInt(urlParams.get('id')) || 1;

                let product = {
                    id: pid,
                    name: document.querySelector('.p-title')?.innerText || "Product",
                    price: document.querySelector('.p-price')?.innerText || "₹1,699",
                    image: document.querySelector('.carousel-slide img')?.src || "",
                    link: window.location.href
                };

                if (typeof productsData !== 'undefined') {
                    const found = productsData.find(p => p.id === pid);
                    if (found) product = found;
                }

                if (window.addToCart) {
                    window.addToCart(product, customFitData.recommendedSize, customFitData);
                    closeModal();

                    const btnEl = e.target;
                    btnEl.innerHTML = "ADDED ✓";
                    btnEl.style.background = "#4caf50";

                    setTimeout(() => {
                        window.location.href = 'cart.html';
                    }, 500);
                } else {
                    console.error("addToCart function not found!");
                    alert("Error: Cart function not initialized.");
                    location.reload();
                }
            });
        };

        renderView();
    };

    const renderNoMeasurements = () => {
        renderAddSizeOptions();
    };

    const renderError = (msg) => {
        contentArea.innerHTML = `
            <div style="text-align:center; padding:20px 0;">
                <span class="material-symbols-outlined" style="font-size:48px; color:#f87171; margin-bottom:12px; display:block;">error</span>
                <p style="color:#444; font-size:14px; margin-bottom:20px;">${msg}</p>
                <div class="modal-actions">
                    <button class="modal-btn btn-secondary" onclick="location.reload()">Retry</button>
                </div>
            </div>
        `;
    };

    // ─── RECOMMENDATION HIGHLIGHT ON PAGE LOAD ────────────────────────────

    // 1. Try localStorage first (instant, no login needed)
    const cachedData = JSON.parse(localStorage.getItem('slyteFitResult') || localStorage.getItem('dashFitResult') || 'null');
    const cachedList = Array.isArray(cachedData) ? cachedData : (cachedData ? [cachedData] : []);
    if (cachedList.length > 0 && cachedList[0].waist) {
        highlightRecommendedSize(parseFloat(cachedList[0].waist));
    }

    // 2. If logged in, sync from Firestore and merge with local cache
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            try {
                const predictionsRef = collection(db, "users", user.uid, "predictions");
                const q = query(predictionsRef, orderBy("created_at", "desc"), limit(1));
                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    const data = querySnapshot.docs[0].data();
                    if (data.waist) {
                        // Merge with existing local data instead of overwriting
                        const existingLocal = JSON.parse(localStorage.getItem('slyteFitResult') || '[]');
                        const localList = Array.isArray(existingLocal) ? existingLocal : (existingLocal ? [existingLocal] : []);
                        const merged = mergeFitLists(localList, [data]);
                        localStorage.setItem('slyteFitResult', JSON.stringify(merged));
                        highlightRecommendedSize(merged[0]?.waist || data.waist);
                    }
                }
            } catch (e) {
                console.log("Error syncing recommendation from Firestore:", e);
            }
        }
    });

    // ─── CUSTOM FIT BUTTON CLICK ──────────────────────────────────────────

    customFitBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        openModal();
        renderLoading();

        // 1. Read from localStorage cache (no login needed)
        const cachedData = JSON.parse(localStorage.getItem('slyteFitResult') || localStorage.getItem('dashFitResult') || 'null');
        const cachedList = Array.isArray(cachedData) ? cachedData : (cachedData ? [cachedData] : []);

        if (cachedList.length > 0) {
            renderMeasurementsTable(cachedList);
            return;
        }

        // 2. If logged in, try Firestore and merge with local data
        const user = auth.currentUser;
        if (user) {
            try {
                const predictionsRef = collection(db, "users", user.uid, "predictions");
                const q = query(predictionsRef, orderBy("created_at", "desc"));
                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    const firestoreList = [];
                    querySnapshot.forEach((doc) => firestoreList.push(doc.data()));
                    // Merge Firestore data with any existing local entries
                    const existingLocal = JSON.parse(localStorage.getItem('slyteFitResult') || '[]');
                    const localList = Array.isArray(existingLocal) ? existingLocal : (existingLocal ? [existingLocal] : []);
                    const merged = mergeFitLists(localList, firestoreList);
                    localStorage.setItem('slyteFitResult', JSON.stringify(merged));
                    renderMeasurementsTable(merged);
                } else {
                    // Legacy: check user profile doc
                    const userRef = doc(db, "users", user.uid);
                    const userSnap = await getDoc(userRef);

                    if (userSnap.exists()) {
                        const data = userSnap.data();
                        if (data.waist && data.inseam) {
                            const existingLocal = JSON.parse(localStorage.getItem('slyteFitResult') || '[]');
                            const localList = Array.isArray(existingLocal) ? existingLocal : (existingLocal ? [existingLocal] : []);
                            const merged = mergeFitLists(localList, [data]);
                            localStorage.setItem('slyteFitResult', JSON.stringify(merged));
                            renderMeasurementsTable(merged);
                            return;
                        }
                    }
                    renderNoMeasurements();
                }
            } catch (error) {
                console.error("Error fetching measurements:", error);
                renderError("Failed to fetch measurements. Please try again.");
            }
        } else {
            // Not logged in, no cache
            renderNoMeasurements();
        }
    });
};

// Run after DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCustomFit);
} else {
    initCustomFit();
}
