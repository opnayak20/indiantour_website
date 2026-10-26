<?php
// backend/helpers/mailer.php

class Mailer {
    private static function getCredentials() {
        return [
            'host' => getenv('SMTP_HOST') ?: 'ssl://smtp.gmail.com',
            'port' => getenv('SMTP_PORT') ? (int)getenv('SMTP_PORT') : 465,
            'user' => getenv('SMTP_USER') ?: '',
            'pass' => str_replace(' ', '', getenv('SMTP_PASS') ?: ''),
            'from' => getenv('SMTP_FROM_NAME') ?: 'Adventure Nature Club'
        ];
    }

    /**
     * Send email via direct SSL socket communication with Gmail SMTP server
     */
    public static function sendOtpEmail($toEmail, $otpCode, $recipientName = 'Adventurer') {
        $creds = self::getCredentials();
        $subject = "Your Verification Code: {$otpCode} - Adventure Nature Club";
        
        $htmlContent = "
        <div style='background-color:#09120C; color:#FFFFFF; font-family:sans-serif; padding:30px; border-radius:16px; max-width:520px; margin:0 auto; border:1px solid #C9A227;'>
            <div style='text-align:center; margin-bottom:20px;'>
                <h1 style='color:#C9A227; margin:0; font-size:22px; letter-spacing:1px;'>ADVENTURE NATURE CLUB</h1>
                <p style='color:#6FAE3C; font-size:13px; margin-top:5px; text-transform:uppercase;'>Wilderness & High Altitude Expeditions</p>
            </div>
            <div style='background-color:rgba(255,255,255,0.05); padding:20px; border-radius:12px; border:1px solid rgba(255,255,255,0.1);'>
                <p style='color:#FFFFFF; font-size:15px; margin-top:0;'>Hello <strong>" . htmlspecialchars($recipientName) . "</strong>,</p>
                <p style='color:#D1D5DB; font-size:14px; line-height:1.5;'>Thank you for joining Adventure Nature Club. Use the following One-Time Password (OTP) to verify your email and complete your account registration:</p>
                <div style='text-align:center; margin:25px 0;'>
                    <span style='display:inline-block; font-size:32px; font-weight:800; letter-spacing:6px; color:#6FAE3C; background:#070E09; padding:12px 24px; border-radius:10px; border:1.5px solid #6FAE3C;'>{$otpCode}</span>
                </div>
                <p style='color:#9CA3AF; font-size:12px; margin-bottom:0;'>⏳ This code will expire in <strong>10 minutes</strong>. If you did not request this, please ignore this email.</p>
            </div>
            <div style='text-align:center; margin-top:20px; color:#6B7280; font-size:12px;'>
                Indian Tour & Travel • W35P+M9P, Road, Alipur Ibrahimpur Urf Ikk, Haridwar, Uttarakhand 249402<br>
                Phone / WhatsApp: +91 9548436762 • Certified Mountain & Wilderness Safety
            </div>
        </div>
        ";

        return self::sendSmtpMail($toEmail, $subject, $htmlContent, $creds);
    }

    private static function sendSmtpMail($to, $subject, $bodyHtml, $creds) {
        if (empty($creds['user']) || empty($creds['pass'])) {
            error_log("SMTP credentials missing (SMTP_USER or SMTP_PASS not configured).");
            return false;
        }

        $timeout = 10;
        $socket = @fsockopen($creds['host'], $creds['port'], $errno, $errstr, $timeout);

        if (!$socket) {
            error_log("SMTP connection failed: {$errstr} ({$errno})");
            return false;
        }

        // Helper to read server response
        $read = function() use ($socket) {
            $data = '';
            while ($str = fgets($socket, 515)) {
                $data .= $str;
                if (substr($str, 3, 1) == " ") break;
            }
            return $data;
        };

        // Helper to send command
        $send = function($cmd) use ($socket) {
            fputs($socket, $cmd . "\r\n");
        };

        $read(); // Initial server greeting

        $send("EHLO localhost");
        $read();

        $send("AUTH LOGIN");
        $read();

        $send(base64_encode($creds['user']));
        $read();

        $send(base64_encode($creds['pass']));
        $authResponse = $read();

        if (strpos($authResponse, '235') === false) {
            error_log("SMTP Auth failed: " . $authResponse);
            fclose($socket);
            return false;
        }

        $send("MAIL FROM: <" . $creds['user'] . ">");
        $read();

        $send("RCPT TO: <" . $to . ">");
        $read();

        $send("DATA");
        $read();

        $headers  = "MIME-Version: 1.0\r\n";
        $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
        $headers .= "From: " . $creds['from'] . " <" . $creds['user'] . ">\r\n";
        $headers .= "To: <" . $to . ">\r\n";
        $headers .= "Subject: " . $subject . "\r\n";
        $headers .= "X-Mailer: AdventureNatureClub-PHP\r\n";

        $message = $headers . "\r\n" . $bodyHtml . "\r\n.\r\n";
        $send($message);
        $dataResponse = $read();

        $send("QUIT");
        $read();
        fclose($socket);

        return strpos($dataResponse, '250') !== false;
    }
}
