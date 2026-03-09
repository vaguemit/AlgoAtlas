import { PolicyLayout } from "@/components/policy/policy-layout";

export const metadata = {
  title: "Privacy Policy | AlgoAtlas",
  description: "Privacy Policy for AlgoAtlas platform",
};

export default function PrivacyPolicyPage() {
  return (
    <PolicyLayout 
      title="Privacy Policy" 
      lastUpdated="April 7, 2024"
    >
      <h2>1. Introduction</h2>
      <p>
        AlgoAtlas ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how 
        we collect, use, disclose, and safeguard your information when you use our website and services.
      </p>
      <p>
        By using AlgoAtlas, you agree to the collection and use of information in accordance with this policy.
      </p>

      <h2>2. Information We Collect</h2>
      <h3>2.1 Personal Information</h3>
      <p>We may collect personal information that you voluntarily provide to us when you:</p>
      <ul>
        <li>Register for an account</li>
        <li>Sign up for our newsletter</li>
        <li>Contact our support team</li>
        <li>Participate in surveys or contests</li>
      </ul>
      <p>This information may include:</p>
      <ul>
        <li>Name</li>
        <li>Email address</li>
        <li>Profile information</li>
        <li>Social media account information (if you choose to link your accounts)</li>
      </ul>

      <h3>2.2 Usage Data</h3>
      <p>
        We may also collect information about how you access and use AlgoAtlas, including:
      </p>
      <ul>
        <li>IP address</li>
        <li>Browser type and version</li>
        <li>Device information</li>
        <li>Pages you visit</li>
        <li>Time and date of your visits</li>
        <li>Time spent on those pages</li>
        <li>Unique device identifiers</li>
      </ul>

      <h3>2.3 Learning and Progress Data</h3>
      <p>
        To provide you with a personalized learning experience, we collect data about your learning progress, 
        including:
      </p>
      <ul>
        <li>Problems you've completed</li>
        <li>Challenges you've attempted</li>
        <li>Your performance on exercises</li>
        <li>Learning paths you've engaged with</li>
      </ul>

      <h2>3. How We Use Your Information</h2>
      <p>We may use the information we collect for various purposes, including to:</p>
      <ul>
        <li>Provide, maintain, and improve our services</li>
        <li>Create and manage your account</li>
        <li>Send you important information, such as confirmations, technical notices, updates, and security alerts</li>
        <li>Respond to your comments, questions, and requests</li>
        <li>Personalize your experience and deliver content relevant to your interests</li>
        <li>Monitor and analyze trends, usage, and activities in connection with our services</li>
        <li>Detect, investigate, and prevent fraudulent transactions and other illegal activities</li>
        <li>Comply with legal obligations</li>
      </ul>

      <h2>4. Disclosure of Your Information</h2>
      <p>We may share your information in the following situations:</p>
      <ul>
        <li><strong>Service Providers:</strong> We may share your information with third-party vendors, service providers, contractors, 
          or agents who perform services for us or on our behalf.</li>
        <li><strong>Business Transfers:</strong> If we are involved in a merger, acquisition, or sale of all or a portion of our assets, 
          your information may be transferred as part of that transaction.</li>
        <li><strong>Legal Requirements:</strong> We may disclose your information if required to do so by law or in response to valid 
          requests by public authorities.</li>
        <li><strong>With Your Consent:</strong> We may share your information with your consent or at your direction.</li>
      </ul>

      <h2>5. Data Security</h2>
      <p>
        We implement appropriate technical and organizational measures to protect the security of your personal information. 
        However, please be aware that no method of transmission over the Internet or method of electronic storage is 100% secure.
      </p>

      <h2>6. Your Data Protection Rights</h2>
      <p>
        Depending on your location, you may have certain rights regarding your personal information, including:
      </p>
      <ul>
        <li>The right to access the personal information we have about you</li>
        <li>The right to request correction of inaccurate personal information</li>
        <li>The right to request deletion of your personal information</li>
        <li>The right to restrict or object to processing of your personal information</li>
        <li>The right to data portability</li>
        <li>The right to withdraw consent</li>
      </ul>
      <p>
        To exercise any of these rights, please contact us using the information provided at the end of this policy.
      </p>

      <h2>7. Children's Privacy</h2>
      <p>
        Our services are not intended for users under the age of 13. We do not knowingly collect personally identifiable 
        information from children under 13.
      </p>

      <h2>8. Third-Party Services</h2>
      <p>
        Our service may contain links to third-party websites or services that are not owned or controlled by us. 
        We have no control over and assume no responsibility for the content, privacy policies, or practices of any 
        third-party websites or services.
      </p>

      <h2>9. Changes to This Privacy Policy</h2>
      <p>
        We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new 
        Privacy Policy on this page and updating the "last updated" date.
      </p>

      <h2>10. Contact Us</h2>
      <p>
        If you have any questions about this Privacy Policy, please contact us at <a href="mailto:privacy@algoatlas.com">privacy@algoatlas.com</a>.
      </p>
    </PolicyLayout>
  );
} 