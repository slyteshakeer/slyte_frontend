/**
 * Slyte Cashfree One-Click Checkout Auth Modal
 * Premium Black UI/UX 2-Step Mobile OTP Authentication before launching Cashfree payment gateway.
 */
(function () {
    var API_BASE = "https://api.slyte.in";

    function cleanupDummyPhone() {
        try {
            ["slyte_phone", "userPhone", "dash_phone", "slyteUser", "slyte_otp_token"].forEach(function (key) {
                var val = localStorage.getItem(key);
                if (val && val.includes("9999999999")) {
                    localStorage.removeItem(key);
                }
            });
        } catch (e) {}
    }
    cleanupDummyPhone();

    function getVerifiedCustomerPhone() {
        cleanupDummyPhone();
        var phone = localStorage.getItem("slyte_phone") || localStorage.getItem("userPhone") || "";
        var token = localStorage.getItem("slyte_otp_token") || "";
        var clean = String(phone).replace(/\D/g, "").slice(-10);
        if (clean.length === 10 && clean !== "9999999999" && token) {
            return clean;
        }
        return null;
    }

    function createModalDom() {
        if (document.getElementById("slyte-auth-modal-overlay")) return;

        var overlay = document.createElement("div");
        overlay.id = "slyte-auth-modal-overlay";
        overlay.style.cssText = [
            "position: fixed;",
            "top: 0; left: 0; right: 0; bottom: 0;",
            "background: rgba(15, 23, 42, 0.75);",
            "backdrop-filter: blur(8px);",
            "z-index: 99999;",
            "display: none;",
            "align-items: center;",
            "justify-content: center;",
            "padding: 16px;",
            "font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;"
        ].join(" ");

        overlay.innerHTML = `
            <div style="
                background: #ffffff;
                width: 100%;
                max-width: 400px;
                border-radius: 20px;
                padding: 28px 24px;
                box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.35);
                position: relative;
                box-sizing: border-box;
                border: 1px solid #0f172a;
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
                    color: #0f172a;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 700;
                ">&times;</button>

                <!-- STEP 1: MOBILE NUMBER ENTRY -->
                <div id="slyte-auth-step-1">
                    <div style="text-align: left; margin-bottom: 20px;">
                        <h3 style="margin: 0 0 6px; font-size: 19px; font-weight: 900; color: #000000; letter-spacing: -0.3px;">Mobile Verification</h3>
                        <p style="margin: 0; font-size: 13px; color: #64748b;">Enter your mobile number to get OTP and proceed</p>
                    </div>

                    <div style="margin-bottom: 16px;">
                        <div style="display: flex; gap: 8px;">
                            <div style="padding: 12px 14px; background: #000000; border: 1.5px solid #000000; border-radius: 10px; font-weight: 800; color: #ffffff; font-size: 15px; display: flex; align-items: center;">+91</div>
                            <input type="tel" id="slyte-auth-phone-input" placeholder="Enter mobile number" maxlength="10" style="
                                flex: 1;
                                height: 48px;
                                border: 1.5px solid #000000;
                                border-radius: 10px;
                                padding: 0 14px;
                                font-size: 16px;
                                font-weight: 700;
                                background: #ffffff;
                                color: #000000;
                                outline: none;
                                box-sizing: border-box;
                            " />
                        </div>
                        <p style="margin: 6px 0 0; font-size: 11px; color: #64748b;">This phone number will be used for payment & tracking updates.</p>
                    </div>

                    <div style="margin-bottom: 18px; display: flex; align-items: center; gap: 8px;">
                        <input type="checkbox" id="slyte-auth-optin" checked style="width: 16px; height: 16px; accent-color: #000000; cursor: pointer;" />
                        <label for="slyte-auth-optin" style="font-size: 12px; color: #000000; font-weight: 600; cursor: pointer;">Send me order updates and offers</label>
                    </div>

                    <div id="slyte-auth-phone-error" style="color: #dc2626; font-size: 12px; font-weight: 700; margin-bottom: 12px; display: none;"></div>

                    <button id="slyte-auth-get-otp-btn" style="
                        width: 100%;
                        height: 48px;
                        background: #000000;
                        color: #ffffff;
                        border: none;
                        border-radius: 10px;
                        font-weight: 800;
                        font-size: 15px;
                        letter-spacing: 0.5px;
                        cursor: pointer;
                        transition: background 0.2s, transform 0.1s;
                        margin-bottom: 14px;
                    ">GET OTP</button>
                </div>

                <!-- STEP 2: OTP ENTRY -->
                <div id="slyte-auth-step-2" style="display: none;">
                    <div style="text-align: left; margin-bottom: 20px;">
                        <h3 style="margin: 0 0 6px; font-size: 19px; font-weight: 900; color: #000000; letter-spacing: -0.3px;">Enter OTP</h3>
                        <p style="margin: 0; font-size: 13px; color: #64748b;">
                            OTP sent to <strong id="slyte-auth-target-phone" style="color: #000000;">+91 </strong>
                            <button id="slyte-auth-edit-phone" style="background: none; border: none; color: #000000; font-size: 12px; font-weight: 800; cursor: pointer; padding: 0 0 0 4px; text-decoration: underline;">Edit</button>
                        </p>
                    </div>

                    <div style="margin-bottom: 16px;">
                        <input type="text" id="slyte-auth-otp-input" placeholder="Enter 6-digit OTP" maxlength="6" style="
                            width: 100%;
                            height: 48px;
                            border: 1.5px solid #000000;
                            border-radius: 10px;
                            padding: 0 14px;
                            font-size: 20px;
                            font-weight: 800;
                            letter-spacing: 6px;
                            text-align: center;
                            background: #ffffff;
                            color: #000000;
                            outline: none;
                            box-sizing: border-box;
                        " />
                    </div>

                    <div id="slyte-auth-otp-error" style="color: #dc2626; font-size: 12px; font-weight: 700; margin-bottom: 12px; display: none;"></div>

                    <button id="slyte-auth-verify-btn" style="
                        width: 100%;
                        height: 48px;
                        background: #000000;
                        color: #ffffff;
                        border: none;
                        border-radius: 10px;
                        font-weight: 800;
                        font-size: 15px;
                        letter-spacing: 0.5px;
                        cursor: pointer;
                        transition: background 0.2s, transform 0.1s;
                        margin-bottom: 12px;
                    ">VERIFY & PAY</button>

                    <div style="text-align: center; margin-bottom: 14px;">
                        <button id="slyte-auth-resend-btn" style="background: none; border: none; color: #475569; font-size: 12px; font-weight: 700; cursor: pointer; text-decoration: underline;">Didn't receive OTP? Resend</button>
                    </div>
                </div>

                <div style="text-align: center; border-top: 1px solid #f1f5f9; padding-top: 12px;">
                    <span style="font-size: 11px; color: #64748b; font-weight: 700; display: inline-flex; align-items: center; gap: 4px;">
                        🔒 Secured by <strong style="color: #000000;">Cashfree Payments</strong>
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

        var step1 = document.getElementById("slyte-auth-step-1");
        var step2 = document.getElementById("slyte-auth-step-2");

        var phoneInput = document.getElementById("slyte-auth-phone-input");
        var phoneErr = document.getElementById("slyte-auth-phone-error");
        var getOtpBtn = document.getElementById("slyte-auth-get-otp-btn");

        var targetPhone = document.getElementById("slyte-auth-target-phone");
        var editPhoneBtn = document.getElementById("slyte-auth-edit-phone");
        var otpInput = document.getElementById("slyte-auth-otp-input");
        var otpErr = document.getElementById("slyte-auth-otp-error");
        var verifyBtn = document.getElementById("slyte-auth-verify-btn");
        var resendBtn = document.getElementById("slyte-auth-resend-btn");

        var currentEnteredPhone = "";

        function showStep1() {
            step1.style.display = "block";
            step2.style.display = "none";
            phoneErr.style.display = "none";
            phoneInput.value = currentEnteredPhone || "";
            phoneInput.focus();
        }

        function showStep2(phone) {
            currentEnteredPhone = phone;
            targetPhone.textContent = "+91 " + phone;
            step1.style.display = "none";
            step2.style.display = "block";
            otpErr.style.display = "none";
            otpInput.value = "";
            otpInput.focus();
        }

        showStep1();
        overlay.style.display = "flex";

        closeBtn.onclick = function () {
            overlay.style.display = "none";
        };

        editPhoneBtn.onclick = function () {
            showStep1();
        };

        async function handleGetOtp() {
            var val = phoneInput.value.trim().replace(/\D/g, "").slice(-10);
            if (val.length < 10 || val === "9999999999") {
                phoneErr.textContent = "Please enter a valid 10-digit mobile number.";
                phoneErr.style.display = "block";
                return;
            }

            phoneErr.style.display = "none";
            getOtpBtn.disabled = true;
            getOtpBtn.textContent = "SENDING OTP...";

            try {
                var res = await fetch(API_BASE + "/send-otp", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ phone: val })
                });
                var data = await res.json().catch(function () { return {}; });

                if (res.ok && data.success) {
                    showStep2(val);
                } else {
                    phoneErr.textContent = data.message || "Failed to send OTP. Please try again.";
                    phoneErr.style.display = "block";
                }
            } catch (err) {
                phoneErr.textContent = "Network error. Please try again.";
                phoneErr.style.display = "block";
            } finally {
                getOtpBtn.disabled = false;
                getOtpBtn.textContent = "GET OTP";
            }
        }

        async function handleVerifyOtp() {
            var otpVal = otpInput.value.trim();
            if (otpVal.length < 4) {
                otpErr.textContent = "Please enter a valid OTP.";
                otpErr.style.display = "block";
                return;
            }

            otpErr.style.display = "none";
            verifyBtn.disabled = true;
            verifyBtn.textContent = "VERIFYING...";

            try {
                var res = await fetch(API_BASE + "/verify-otp", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ phone: currentEnteredPhone, otp: otpVal })
                });
                var data = await res.json().catch(function () { return {}; });

                if (res.ok && data.success) {
                    localStorage.setItem("slyte_phone", currentEnteredPhone);
                    localStorage.setItem("userPhone", currentEnteredPhone);
                    localStorage.setItem("slyte_otp_token", data.token || ("jwt_slyte_cust_" + currentEnteredPhone + "_" + Date.now()));
                    overlay.style.display = "none";
                    onSuccessCallback(currentEnteredPhone);
                } else {
                    otpErr.textContent = data.message || "Invalid OTP. Please try again.";
                    otpErr.style.display = "block";
                }
            } catch (err) {
                otpErr.textContent = "Network error. Please verify your connection.";
                otpErr.style.display = "block";
            } finally {
                verifyBtn.disabled = false;
                verifyBtn.textContent = "VERIFY & PAY";
            }
        }

        getOtpBtn.onclick = handleGetOtp;
        phoneInput.onkeyup = function (e) {
            if (e.key === "Enter") handleGetOtp();
        };

        verifyBtn.onclick = handleVerifyOtp;
        otpInput.onkeyup = function (e) {
            if (e.key === "Enter") handleVerifyOtp();
        };

        resendBtn.onclick = handleGetOtp;
    }

    window.getVerifiedCustomerPhone = getVerifiedCustomerPhone;
    window.ensureVerifiedPhone = ensureVerifiedPhone;
})();
