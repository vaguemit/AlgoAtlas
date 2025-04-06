import { PolicyLayout } from "@/components/policy/policy-layout";

export const metadata = {
  title: "Cookie Policy | AlgoAtlas",
  description: "Cookie Policy for AlgoAtlas platform",
};

export default function CookiePolicyPage() {
  return (
    <PolicyLayout 
      title="Cookie Policy" 
      lastUpdated="April 7, 2024"
    >
      <h2>1. What Are Cookies?</h2>
      <p>
        Cookies are small text files that are stored on your device (computer, tablet, or mobile) when you visit websites. 
        Cookies are widely used to make websites work more efficiently and provide information to the website owners.
      </p>

      <h2>2. How We Use Cookies</h2>
      <p>
        AlgoAtlas uses cookies for several purposes, including:
      </p>
      <ul>
        <li>
          <strong>Essential Cookies:</strong> These cookies are necessary for the website to function properly. They enable 
          basic functions like page navigation and access to secure areas of the website. The website cannot function properly 
          without these cookies.
        </li>
        <li>
          <strong>Preference Cookies:</strong> These cookies allow the website to remember choices you have made in the past, 
          such as your preferred language, your login information, or your display preferences.
        </li>
        <li>
          <strong>Analytics Cookies:</strong> These cookies help us understand how visitors interact with our website by 
          collecting and reporting information anonymously. They help us improve the website's performance and user experience.
        </li>
        <li>
          <strong>Functionality Cookies:</strong> These cookies enable the website to provide enhanced functionality and 
          personalization, such as remembering your coding preferences or saving your progress in courses and challenges.
        </li>
      </ul>

      <h2>3. Types of Cookies We Use</h2>
      <h3>3.1 Session Cookies</h3>
      <p>
        Session cookies are temporary and expire when you close your browser. They are used to improve your experience 
        during a single browsing session.
      </p>

      <h3>3.2 Persistent Cookies</h3>
      <p>
        Persistent cookies remain on your device for a set period or until you delete them manually. They are used to 
        recognize you when you return to AlgoAtlas and help provide a personalized experience.
      </p>

      <h3>3.3 First-Party Cookies</h3>
      <p>
        First-party cookies are set by AlgoAtlas directly and can only be read by our website.
      </p>

      <h3>3.4 Third-Party Cookies</h3>
      <p>
        Third-party cookies are set by services we use on our website, such as analytics or social media providers.
      </p>

      <h2>4. Specific Cookies We Use</h2>
      <table className="border-collapse border border-white/20 w-full mt-4">
        <thead>
          <tr className="bg-purple-900/30">
            <th className="border border-white/20 px-4 py-2 text-left">Cookie Name</th>
            <th className="border border-white/20 px-4 py-2 text-left">Type</th>
            <th className="border border-white/20 px-4 py-2 text-left">Purpose</th>
            <th className="border border-white/20 px-4 py-2 text-left">Duration</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-white/20 px-4 py-2">auth_session</td>
            <td className="border border-white/20 px-4 py-2">Essential</td>
            <td className="border border-white/20 px-4 py-2">Handles user authentication and login state</td>
            <td className="border border-white/20 px-4 py-2">Session</td>
          </tr>
          <tr>
            <td className="border border-white/20 px-4 py-2">user_preferences</td>
            <td className="border border-white/20 px-4 py-2">Preference</td>
            <td className="border border-white/20 px-4 py-2">Stores user preferences for site appearance and settings</td>
            <td className="border border-white/20 px-4 py-2">1 year</td>
          </tr>
          <tr>
            <td className="border border-white/20 px-4 py-2">_ga</td>
            <td className="border border-white/20 px-4 py-2">Analytics (Third-party)</td>
            <td className="border border-white/20 px-4 py-2">Google Analytics cookie used to distinguish users</td>
            <td className="border border-white/20 px-4 py-2">2 years</td>
          </tr>
          <tr>
            <td className="border border-white/20 px-4 py-2">_gid</td>
            <td className="border border-white/20 px-4 py-2">Analytics (Third-party)</td>
            <td className="border border-white/20 px-4 py-2">Google Analytics cookie used to distinguish users</td>
            <td className="border border-white/20 px-4 py-2">24 hours</td>
          </tr>
          <tr>
            <td className="border border-white/20 px-4 py-2">learning_progress</td>
            <td className="border border-white/20 px-4 py-2">Functionality</td>
            <td className="border border-white/20 px-4 py-2">Tracks user progress in learning paths and challenges</td>
            <td className="border border-white/20 px-4 py-2">6 months</td>
          </tr>
        </tbody>
      </table>

      <h2>5. Managing Cookies</h2>
      <p>
        Most web browsers allow you to control cookies through their settings. You can typically find these settings 
        in the "Options," "Preferences," or "Settings" menu of your browser. You can:
      </p>
      <ul>
        <li>Delete all cookies from your browser</li>
        <li>Block all cookies by default</li>
        <li>Allow only first-party cookies</li>
        <li>Browse in private or incognito mode, which doesn't store cookies after your session</li>
      </ul>
      <p>
        Please note that if you choose to block or delete cookies, some features of AlgoAtlas may not function properly.
      </p>

      <h2>6. Changes to This Cookie Policy</h2>
      <p>
        We may update our Cookie Policy from time to time. We will notify you of any changes by posting the new 
        Cookie Policy on this page and updating the "last updated" date.
      </p>

      <h2>7. Contact Us</h2>
      <p>
        If you have any questions about this Cookie Policy, please contact us at <a href="mailto:privacy@algoatlas.com">privacy@algoatlas.com</a>.
      </p>
    </PolicyLayout>
  );
} 