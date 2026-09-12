/**
 * Slyte Cashfree One-Click Checkout Mobile Entry
 * Prompts user for their mobile number with an empty input box before opening Cashfree payment gateway.
 */
(function () {
    // Purge any legacy test phone numbers from localStorage
    function cleanupDummyPhone() {
        try {
            ["slyte_phone", "userPhone", "dash_phone", "slyteUser", "slyte_otp_token"].forEach(function (key) {
                var val = localStorage.getItem(key);
                if (val && (val.includes("9999999999") || val.includes("9742006683"))) {
                    localStorage.removeItem(key);
                }
            });
        } catch (e) {}
    }
    cleanupDummyPhone();

    function getVerifiedCustomerPhone() {
        cleanupDummyPhone();
        var phone = localStorage.getItem("slyte_phone") || localStorage.getItem("userPhone") || "";
        var clean = String(phone).replace(/\D/g, "").slice(-10);
        if (clean.length === 10 && clean !== "9999999999" && clean !== "9742006683") {
            return clean;
        }
        return null;
    }

    function createModalDom() {
        if (document.getElementById("slyte-auth-modal-overlay")) return;

        var overlay = document.createElement("div");
        overlay.id = "slyte-auth-modal-overlay";
        overlay.style.cssText = `
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(15, 23, 42, 0.65);
            backdrop-filter: blur(6px);
            z-index: 99999;
            display: none;
            align-items: center;
            justify-content: center;
            padding: 16px;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        `;

        overlay.innerHTML = `
            <div style="
                background: #ffffff;
                width: 100%;
                max-width: 400px;
                border-radius: 20px;
                padding: 28px 24px;
                box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
                position: relative;
                box-sizing: border-box;
            ">
                <button id="slyte-auth-close" style="
                    position: absolute;
                    top: 18px; right: 18px;
                    background: #f1f5f9;
                    border: none;
                    width: 32px; height: 32px;
                    border-radius: 50%;
                    cursor: pointer;
                    font-size: 18px;
                    color: #64748b;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                ">&times;</button>

                <div style="text-align: left; margin-bottom: 20px;">
                    <h3 style="margin: 0 0 6px; font-size: 18px; font-weight: 800; color: #0f172a;">Mobile Number</h3>
                    <p style="margin: 0; font-size: 12px; color: #64748b;">Enter your number to proceed with payment</p>
                </div>

                <div style="margin-bottom: 14px;">
                    <div style="display: flex; gap: 8px;">
                        <div style="padding: 12px 14px; background: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 10px; font-weight: 700; color: #334155; font-size: 15px; display: flex; align-items: center;">+91</div>
                        <input type="tel" id="slyte-auth-phone-input" placeholder="Enter mobile number" maxlength="10" style="
                            flex: 1;
                            height: 48px;
                            border: 1.5px solid #e2e8f0;
                            border-radius: 10px;
                            padding: 0 14px;
                            font-size: 16px;
                            font-weight: 600;
                            background: #ffffff;
                            color: #0f172a;
                            outline: none;
                            box-sizing: border-box;
                        " />
                    </div>
                    <p style="margin: 6px 0 0; font-size: 11px; color: #64748b;">This phone number will be used in your payment methods & tracking.</p>
                </div>

                <div style="margin-bottom: 20px; display: flex; align-items: center; gap: 8px;">
                    <input type="checkbox" id="slyte-auth-optin" checked style="width: 16px; height: 16px; accent-color: #2563eb; cursor: pointer;" />
                    <label for="slyte-auth-optin" style="font-size: 12px; color: #475569; cursor: pointer;">Send me order updates and offers</label>
                </div>

                <div id="slyte-auth-phone-error" style="color: #ef4444; font-size: 12px; font-weight: 600; margin-bottom: 12px; display: none;"></div>

                <button id="slyte-auth-save-btn" style="
                    width: 100%;
                    height: 48px;
                    background: #2563eb;
                    color: #ffffff;
                    border: none;
                    border-radius: 10px;
                    font-weight: 700;
                    font-size: 15px;
                    cursor: pointer;
                    transition: background 0.2s;
                    margin-bottom: 14px;
                ">SAVE & CONTINUE TO PAYMENT</button>

                <div style="text-align: center; border-top: 1px solid #f1f5f9; padding-top: 12px;">
                    <span style="font-size: 11px; color: #94a3b8; font-weight: 600; display: inline-flex; align-items: center; gap: 4px;">
                        🔒 Secured by <strong style="color: #475569;">Cashfree Payments</strong>
                    </span>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);
    }

    function ensureVerifiedPhone(onSuccessCallback) {
        var currentPhone = getVerifiedCustomerPhone();
        if (currentPhone) {
            onSuccessCallback(currentPhone);
            return;
        }

        createModalDom();
        var overlay = document.getElementById("slyte-auth-modal-overlay");
        var closeBtn = document.getElementById("slyte-auth-close");
        var phoneInput = document.getElementById("slyte-auth-phone-input");
        var phoneErr = document.getElementById("slyte-auth-phone-error");
        var saveBtn = document.getElementById("slyte-auth-save-btn");

        phoneInput.value = "";
        phoneErr.style.display = "none";
        overlay.style.display = "flex";
        phoneInput.focus();

        closeBtn.onclick = function () {
            overlay.style.display = "none";
        };

        function handleSave() {
            var val = phoneInput.value.trim().replace(/\D/g, "").slice(-10);
            if (val.length < 10 || val === "9999999999" || val === "9742006683") {
                phoneErr.textContent = "Please enter a valid 10-digit mobile number.";
                phoneErr.style.display = "block";
                return;
            }
            phoneErr.style.display = "none";
            localStorage.setItem("slyte_phone", val);
            localStorage.setItem("userPhone", val);
            overlay.style.display = "none";
            onSuccessCallback(val);
        }

        saveBtn.onclick = handleSave;
        phoneInput.onkeyup = function (e) {
            if (e.key === "Enter") handleSave();
        };
    }

    window.getVerifiedCustomerPhone = getVerifiedCustomerPhone;
    window.ensureVerifiedPhone = ensureVerifiedPhone;
})();
