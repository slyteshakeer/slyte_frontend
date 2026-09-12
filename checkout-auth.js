/**
 * Slyte Checkout Auth Modal
 * Ensures verified 10-digit customer mobile number before proceeding to Cashfree payment.
 * Prevents any dummy phone usage (e.g. 9999999999).
 */
(function () {
    // Purge any legacy 9999999999 from localStorage
    function cleanupDummyPhone() {
        try {
            ["slyte_phone", "userPhone", "dash_phone", "slyteUser", "slyte_otp_token"].forEach(function (key) {
                var val = localStorage.getItem(key);
                if (val && (val === "9999999999" || val.includes("9999999999"))) {
                    localStorage.removeItem(key);
                }
            });
        } catch (e) {}
    }
    cleanupDummyPhone();

    function getApiBase() {
        if (typeof window !== "undefined" && window.SLYTE_CONFIG && window.SLYTE_CONFIG.API_BASE_URL) {
            return String(window.SLYTE_CONFIG.API_BASE_URL).replace(/\/$/, "");
        }
        return (window.SLYTE_API_BASE || "https://api.slyte.in").replace(/\/$/, "");
    }

    function getVerifiedCustomerPhone() {
        cleanupDummyPhone();
        var phone = localStorage.getItem("slyte_phone") || localStorage.getItem("userPhone") || "";
        var clean = String(phone).replace(/\D/g, "").slice(-10);
        if (clean.length === 10 && clean !== "9999999999") {
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

                <!-- Step 1: Phone Entry -->
                <div id="slyte-auth-step-phone">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <div style="width: 48px; height: 48px; background: #e0e7ff; color: #4338ca; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 12px; font-size: 24px; font-weight: 700;">📱</div>
                        <h3 style="margin: 0 0 6px; font-size: 20px; font-weight: 800; color: #0f172a;">Verify Mobile Number</h3>
                        <p style="margin: 0; font-size: 13px; color: #64748b;">Enter your 10-digit mobile number to proceed to payment</p>
                    </div>

                    <div style="margin-bottom: 16px;">
                        <label style="display: block; font-size: 12px; font-weight: 700; color: #334155; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px;">Mobile Number</label>
                        <div style="display: flex; gap: 8px;">
                            <div style="padding: 12px 14px; background: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 10px; font-weight: 700; color: #334155; font-size: 15px; display: flex; align-items: center;">+91</div>
                            <input type="tel" id="slyte-auth-phone-input" placeholder="Enter 10-digit mobile number" maxlength="10" style="
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
                    </div>

                    <div id="slyte-auth-phone-error" style="color: #ef4444; font-size: 12px; font-weight: 600; margin-bottom: 12px; display: none;"></div>

                    <button id="slyte-auth-send-otp-btn" style="
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
                    ">GET OTP & PROCEED</button>
                </div>

                <!-- Step 2: OTP Verification -->
                <div id="slyte-auth-step-otp" style="display: none;">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <div style="width: 48px; height: 48px; background: #dcfce7; color: #15803d; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 12px; font-size: 24px; font-weight: 700;">🔒</div>
                        <h3 style="margin: 0 0 6px; font-size: 20px; font-weight: 800; color: #0f172a;">Enter 6-Digit OTP</h3>
                        <p style="margin: 0; font-size: 13px; color: #64748b;">Sent to <strong id="slyte-auth-target-phone" style="color: #0f172a;">+91</strong> <a href="#" id="slyte-auth-change-phone" style="color: #2563eb; text-decoration: underline; font-weight: 600; font-size: 12px;">Edit</a></p>
                    </div>

                    <div style="margin-bottom: 16px;">
                        <input type="tel" id="slyte-auth-otp-input" placeholder="• • • • • •" maxlength="6" style="
                            width: 100%;
                            height: 52px;
                            border: 1.5px solid #e2e8f0;
                            border-radius: 10px;
                            font-size: 24px;
                            font-weight: 800;
                            text-align: center;
                            letter-spacing: 8px;
                            background: #f8fafc;
                            color: #0f172a;
                            outline: none;
                            box-sizing: border-box;
                        " />
                    </div>

                    <div id="slyte-auth-otp-error" style="color: #ef4444; font-size: 12px; font-weight: 600; margin-bottom: 12px; display: none; text-align: center;"></div>

                    <button id="slyte-auth-verify-btn" style="
                        width: 100%;
                        height: 48px;
                        background: #16a34a;
                        color: #ffffff;
                        border: none;
                        border-radius: 10px;
                        font-weight: 700;
                        font-size: 15px;
                        cursor: pointer;
                        transition: background 0.2s;
                        margin-bottom: 12px;
                    ">VERIFY & CONTINUE TO PAYMENT</button>

                    <div style="text-align: center;">
                        <button type="button" id="slyte-auth-resend-btn" style="background: none; border: none; color: #64748b; font-size: 13px; font-weight: 600; cursor: pointer; text-decoration: underline;">Resend OTP</button>
                    </div>
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

        var stepPhone = document.getElementById("slyte-auth-step-phone");
        var stepOtp = document.getElementById("slyte-auth-step-otp");

        var phoneInput = document.getElementById("slyte-auth-phone-input");
        var phoneErr = document.getElementById("slyte-auth-phone-error");
        var sendOtpBtn = document.getElementById("slyte-auth-send-otp-btn");

        var otpInput = document.getElementById("slyte-auth-otp-input");
        var otpErr = document.getElementById("slyte-auth-otp-error");
        var verifyBtn = document.getElementById("slyte-auth-verify-btn");
        var targetPhoneEl = document.getElementById("slyte-auth-target-phone");
        var changePhoneBtn = document.getElementById("slyte-auth-change-phone");
        var resendBtn = document.getElementById("slyte-auth-resend-btn");

        var targetPhone = "";

        // Reset inputs & states
        phoneInput.value = "";
        otpInput.value = "";
        phoneErr.style.display = "none";
        otpErr.style.display = "none";
        stepPhone.style.display = "block";
        stepOtp.style.display = "none";
        overlay.style.display = "flex";
        phoneInput.focus();

        closeBtn.onclick = function () {
            overlay.style.display = "none";
        };

        changePhoneBtn.onclick = function (e) {
            e.preventDefault();
            stepOtp.style.display = "none";
            stepPhone.style.display = "block";
            phoneInput.focus();
        };

        async function requestOtp() {
            var val = phoneInput.value.trim().replace(/\D/g, "").slice(-10);
            if (val.length < 10 || val === "9999999999") {
                phoneErr.textContent = "Please enter a valid 10-digit mobile number.";
                phoneErr.style.display = "block";
                return;
            }
            phoneErr.style.display = "none";
            sendOtpBtn.disabled = true;
            sendOtpBtn.textContent = "Sending OTP...";

            try {
                var res = await fetch(getApiBase() + "/send-otp", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ phone: val })
                });
                var data = await res.json().catch(function () { return {}; });
                if (res.ok && data.success) {
                    targetPhone = val;
                    targetPhoneEl.textContent = "+91 " + val;
                    stepPhone.style.display = "none";
                    stepOtp.style.display = "block";
                    otpInput.focus();
                } else {
                    phoneErr.textContent = data.message || data.error || "Failed to send OTP.";
                    phoneErr.style.display = "block";
                }
            } catch (e) {
                phoneErr.textContent = "Network error. Please try again.";
                phoneErr.style.display = "block";
            } finally {
                sendOtpBtn.disabled = false;
                sendOtpBtn.textContent = "GET OTP & PROCEED";
            }
        }

        async function verifyOtp() {
            var otp = otpInput.value.trim();
            if (otp.length !== 6) {
                otpErr.textContent = "Enter valid 6-digit OTP.";
                otpErr.style.display = "block";
                return;
            }
            otpErr.style.display = "none";
            verifyBtn.disabled = true;
            verifyBtn.textContent = "Verifying...";

            try {
                var res = await fetch(getApiBase() + "/verify-otp", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ phone: targetPhone, otp: otp })
                });
                var data = await res.json().catch(function () { return {}; });

                if (res.ok && data.success) {
                    var verifiedPhone = (data.user && data.user.phone) ? String(data.user.phone).replace(/\D/g, "").slice(-10) : targetPhone;
                    localStorage.setItem("slyte_phone", verifiedPhone);
                    localStorage.setItem("userPhone", verifiedPhone);
                    if (data.token) {
                        localStorage.setItem("slyte_otp_token", data.token);
                    }
                    overlay.style.display = "none";
                    onSuccessCallback(verifiedPhone);
                } else {
                    otpErr.textContent = data.message || data.error || "Invalid OTP.";
                    otpErr.style.display = "block";
                }
            } catch (e) {
                otpErr.textContent = "Network error. Please try again.";
                otpErr.style.display = "block";
            } finally {
                verifyBtn.disabled = false;
                verifyBtn.textContent = "VERIFY & CONTINUE TO PAYMENT";
            }
        }

        sendOtpBtn.onclick = requestOtp;
        verifyBtn.onclick = verifyOtp;
        resendBtn.onclick = requestOtp;

        phoneInput.onkeyup = function (e) {
            if (e.key === "Enter") requestOtp();
        };
        otpInput.onkeyup = function (e) {
            if (e.key === "Enter") verifyOtp();
        };
    }

    window.getVerifiedCustomerPhone = getVerifiedCustomerPhone;
    window.ensureVerifiedPhone = ensureVerifiedPhone;
})();
