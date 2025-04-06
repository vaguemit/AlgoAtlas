import { PolicyLayout } from "@/components/policy/policy-layout";

export const metadata = {
  title: "Terms of Service | AlgoAtlas",
  description: "Terms of Service for AlgoAtlas platform",
};

export default function TermsPage() {
  return (
    <PolicyLayout 
      title="Terms of Service" 
      lastUpdated="April 7, 2024"
    >
      <h2>1. Acceptance of Terms</h2>
      <p>
        By accessing or using AlgoAtlas ("the Service"), you agree to be bound by these Terms of Service. 
        If you do not agree to these terms, please do not use the Service.
      </p>

      <h2>2. Description of Service</h2>
      <p>
        AlgoAtlas is a platform dedicated to helping users learn algorithms and data structures through interactive 
        tutorials, challenges, practice problems, and educational resources.
      </p>

      <h2>3. User Accounts</h2>
      <p>
        To access certain features, you may need to create an account. You are responsible for maintaining the 
        confidentiality of your account information and for all activities that occur under your account. You agree to:
      </p>
      <ul>
        <li>Provide accurate and complete information when creating your account</li>
        <li>Maintain and promptly update your account information</li>
        <li>Notify us immediately of any unauthorized access to your account</li>
        <li>Take responsibility for all activities that occur under your account</li>
      </ul>

      <h2>4. User Content</h2>
      <p>
        You may be able to submit content to the Service, including code, comments, and other materials. You retain 
        ownership of any intellectual property rights you hold in that content, but by submitting content to the Service, 
        you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, adapt, publish, translate, 
        and distribute it in any existing or future media.
      </p>

      <h2>5. Prohibited Activities</h2>
      <p>You agree not to engage in any of the following activities:</p>
      <ul>
        <li>Violating laws or regulations</li>
        <li>Impersonating another person or entity</li>
        <li>Interfering with the proper functioning of the Service</li>
        <li>Attempting to access areas of the Service that you are not authorized to access</li>
        <li>Submitting content that infringes on intellectual property rights</li>
        <li>Using the Service to distribute malware or other harmful code</li>
        <li>Engaging in any activity that could disable, overburden, or impair the Service</li>
      </ul>

      <h2>6. Intellectual Property</h2>
      <p>
        The Service and its original content, features, and functionality are owned by AlgoAtlas and are protected by 
        international copyright, trademark, patent, trade secret, and other intellectual property laws.
      </p>

      <h2>7. Termination</h2>
      <p>
        We may terminate or suspend your account and access to the Service immediately, without prior notice or liability, 
        for any reason, including without limitation if you breach the Terms of Service.
      </p>

      <h2>8. Disclaimer of Warranties</h2>
      <p>
        The Service is provided "as is" and "as available" without warranties of any kind, either express or implied, 
        including, but not limited to, implied warranties of merchantability, fitness for a particular purpose, or non-infringement.
      </p>

      <h2>9. Limitation of Liability</h2>
      <p>
        To the maximum extent permitted by applicable law, in no event shall AlgoAtlas, its affiliates, directors, employees, 
        or agents be liable for any indirect, punitive, incidental, special, consequential, or exemplary damages, including 
        without limitation damages for loss of profits, goodwill, use, data, or other intangible losses, resulting from your 
        use of the Service.
      </p>

      <h2>10. Changes to Terms</h2>
      <p>
        We reserve the right to modify these Terms of Service at any time. We will provide notice of significant changes by 
        updating the last updated date at the top of these terms and/or by placing a notice on our Service.
      </p>

      <h2>11. Governing Law</h2>
      <p>
        These Terms shall be governed by the laws of [Your Jurisdiction], without regard to its conflict of law provisions.
      </p>

      <h2>12. Contact Us</h2>
      <p>
        If you have any questions about these Terms, please contact us at <a href="mailto:contact@algoatlas.com">contact@algoatlas.com</a>.
      </p>
    </PolicyLayout>
  );
} 