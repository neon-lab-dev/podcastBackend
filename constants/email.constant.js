const SIGNUP_EMAIL = {
    subject: "Welcome to Our Platform! -Delnavaz Podcast 🎉",
    html: (username) => `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to Our Platform</title>
            <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
            <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,200..800&display=swap" rel="stylesheet">
        </head>
        <body style="font-family: 'Bricolage Grotesque', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f4;">
            <div style="background-color: #ffffff; border-radius: 10px; padding: 30px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
                <h1 style="color: #4a4a4a; text-align: center; margin-bottom: 20px; font-weight: 800;">Welcome to Our Platform, ${username}! 🚀</h1>
                <p style="font-size: 16px; font-weight: 400;">We're thrilled to have you join our community! 🎊</p>
                <p style="font-size: 16px; font-weight: 400;">Here are a few things you can do to get started:</p>
                <ul style="list-style-type: none; padding-left: 0;">
                    <li style="margin-bottom: 10px; font-weight: 600;">✅ Complete your profile</li>
                    <li style="margin-bottom: 10px; font-weight: 600;">🔍 Explore our features</li>
                    <li style="margin-bottom: 10px; font-weight: 600;">🤝 Connect with other users</li>
                </ul>
                <p style="font-size: 16px; font-weight: 400;">If you have any questions or need assistance, please don't hesitate to reach out to our support team. We're here to help! 💁‍♂️</p>
                <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                    <p style="font-size: 14px; color: #888; font-weight: 400;">Best regards,<br><span style="font-weight: 600;">The Delnavaz Team</span> 👋</p>
                </div>
            </div>
        </body>
        </html>
    `
};

const ADMIN_NOTIFICATION = {
    subject: " New User Registration Alert 🚨 - Delnavaz Podcast",
    html: (user) => `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>New User Registration</title>
            <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
            <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,200..800&display=swap" rel="stylesheet">
        </head>
        <body style="font-family: 'Bricolage Grotesque', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f4;">
            <div style="background-color: #ffffff; border-radius: 10px; padding: 30px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
                <h1 style="color: #4a4a4a; text-align: center; margin-bottom: 20px; font-weight: 800;">New User Registration 📝</h1>
                <p style="font-size: 16px; font-weight: 400;">A new user has joined our platform. Here are the details:</p>
                <table style="width: 100%; border-collapse: collapse; margin-top: 20px; margin-bottom: 20px;">
                    <tr style="background-color: #f8f8f8;">
                        <td style="padding: 10px; border: 1px solid #ddd; font-weight: 600;">Username:</td>
                        <td style="padding: 10px; border: 1px solid #ddd; font-weight: 400;">👤 ${user.name}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border: 1px solid #ddd; font-weight: 600;">Email:</td>
                        <td style="padding: 10px; border: 1px solid #ddd; font-weight: 400;">📧 ${user.email}</td>
                    </tr>
                    <tr style="background-color: #f8f8f8;">
                        <td style="padding: 10px; border: 1px solid #ddd; font-weight: 600;">Registration Date:</td>
                        <td style="padding: 10px; border: 1px solid #ddd; font-weight: 400;">🗓️ ${new Date().toLocaleString()}</td>
                    </tr>
                </table>
                <p style="font-size: 16px; font-weight: 400;">Please review the new user's account and take any necessary actions. 🔍</p>
                <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                    <p style="font-size: 14px; color: #888; font-weight: 400;">Best regards,<br><span style="font-weight: 600;">The Delnavaz Team</span> 🎙️</p>
                </div>
            </div>
        </body>
        </html>
    `
};

export {
    SIGNUP_EMAIL,
    ADMIN_NOTIFICATION
};
