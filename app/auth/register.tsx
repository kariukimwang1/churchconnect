import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Alert, TouchableOpacity, Switch } from 'react-native'
import { Button, Input, Card, Container } from '@/components/ui'
import { GradientButton } from '@/components/GradientButton'
import { colors, spacing, typography, borderRadius, shadows } from '@/constants/design'
import { useAuth } from '@/hooks/useAuth'
import { useState } from 'react'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { blink } from '@/lib/blink'

// Constants
const DISTRICTS = [
  'Emmanuel District',
  'Nazareth District',
  'Ngaramiyii District',
  'Ebenezer District',
  'Shalom District',
]

const GROUPS = [
  'Men Fellowship',
  'Women\'s Guild',
  'Brigade',
  'Youth',
  'Church School',
  'Evangelism',
  'Choir',
  'BSR (Bible Study & Revival)',
  'JPRC (Junior Presbyterian)',
  'Ushering Department',
  'Intercessory Ministry',
  'Media/Technical Team',
]

const SPIRITUAL_GIFTS = [
  'Teaching',
  'Leadership',
  'Hospitality',
  'Music',
  'Intercession',
  'Evangelism',
  'Helps',
  'Administration',
  'Prophecy',
  'Mercy',
]

const AREAS_TO_SERVE = [
  'Ushering',
  'Worship Team',
  'Sunday School',
  'Technical',
  'Cleanliness',
  'Security',
  'Visiting the Sick',
  'Counseling',
]

const LEADERSHIP_ROLES = [
  'None',
  'Group Leader',
  'Assistant Leader',
  'Secretary',
  'Treasurer',
  'Patron',
]

const CHILD_GROUPS = [
  'Sunday School',
  'Junior Church',
  'Brigade',
  'JPRC',
]

const SECURITY_QUESTIONS = [
  'Mother\'s maiden name',
  'First school',
  'Favorite Bible verse',
  'First pet',
  'Birth city',
]

const NOTIFICATION_CATEGORIES = [
  'Announcements',
  'Prayer Requests',
  'Events',
  'Emergencies',
  'Financial Reports',
]

const LANGUAGES = ['English', 'Kiswahili', 'Kikuyu']

// Child interface
interface Child {
  id: string
  fullName: string
  dateOfBirth: string
  isBaptized: string
  group: string
}

export default function RegisterScreen() {
  const { signUp } = useAuth()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 7

  // Loading state
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  // ============ SECTION 1: Personal Information ============
  const [fullName, setFullName] = useState('')
  const [preferredName, setPreferredName] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [gender, setGender] = useState('')
  const [nationalId, setNationalId] = useState('')
  const [maritalStatus, setMaritalStatus] = useState('')
  const [weddingAnniversary, setWeddingAnniversary] = useState('')
  const [occupation, setOccupation] = useState('')
  const [employer, setEmployer] = useState('')

  // ============ SECTION 2: Church Membership Details ============
  const [dateOfBaptism, setDateOfBaptism] = useState('')
  const [baptismCertificateNumber, setBaptismCertificateNumber] = useState('')
  const [isFullMember, setIsFullMember] = useState('Not Full Member')
  const [previousChurch, setPreviousChurch] = useState('')
  const [dateJoined, setDateJoined] = useState('')
  const [spiritualGifts, setSpiritualGifts] = useState<string[]>([])
  const [areasToServe, setAreasToServe] = useState<string[]>([])

  // ============ SECTION 3: District & Group Participation ============
  const [district, setDistrict] = useState('')
  const [subLocation, setSubLocation] = useState('')
  const [selectedGroups, setSelectedGroups] = useState<string[]>([])
  const [leadershipRole, setLeadershipRole] = useState('')
  const [dateJoinedGroup, setDateJoinedGroup] = useState('')

  // ============ SECTION 4: Contact Information ============
  const [primaryPhone, setPrimaryPhone] = useState('')
  const [secondaryPhone, setSecondaryPhone] = useState('')
  const [email, setEmail] = useState('')
  const [alternativeEmail, setAlternativeEmail] = useState('')
  const [postalAddress, setPostalAddress] = useState('')
  const [physicalAddress, setPhysicalAddress] = useState('')
  const [emergencyContactName, setEmergencyContactName] = useState('')
  const [emergencyContactPhone, setEmergencyContactPhone] = useState('')
  const [emergencyContactRelationship, setEmergencyContactRelationship] = useState('')

  // ============ SECTION 5: Family Information ============
  const [hasChildren, setHasChildren] = useState('No')
  const [children, setChildren] = useState<Child[]>([])
  const [spouseName, setSpouseName] = useState('')
  const [spouseIsMember, setSpouseIsMember] = useState('')
  const [familyHead, setFamilyHead] = useState('')

  // ============ SECTION 6: Login Credentials ============
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [securityQuestion, setSecurityQuestion] = useState('')
  const [securityAnswer, setSecurityAnswer] = useState('')

  // ============ SECTION 7: Preferences & Consent ============
  const [receiveSms, setReceiveSms] = useState(true)
  const [receiveEmail, setReceiveEmail] = useState(true)
  const [selectedNotificationCategories, setSelectedNotificationCategories] = useState<string[]>(['Announcements', 'Events'])
  const [preferredLanguage, setPreferredLanguage] = useState('English')
  const [dataPrivacyConsent, setDataPrivacyConsent] = useState(false)
  const [photoReleaseConsent, setPhotoReleaseConsent] = useState(false)

  // Helper functions
  const toggleItem = (item: string, list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>) => {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item))
    } else {
      setList([...list, item])
    }
  }

  const addChild = () => {
    setChildren([...children, {
      id: Date.now().toString(),
      fullName: '',
      dateOfBirth: '',
      isBaptized: 'Pending',
      group: ''
    }])
  }

  const updateChild = (id: string, field: keyof Child, value: string) => {
    setChildren(children.map(child => 
      child.id === id ? { ...child, [field]: value } : child
    ))
  }

  const removeChild = (id: string) => {
    setChildren(children.filter(child => child.id !== id))
  }

  // Validation
  const validateStep = (step: number): boolean => {
    setError('')
    
    switch (step) {
      case 1:
        if (!fullName.trim()) { setError('Full Name is required'); return false }
        if (!dateOfBirth.trim()) { setError('Date of Birth is required'); return false }
        if (!gender) { setError('Gender is required'); return false }
        if (!nationalId.trim()) { setError('National ID/Passport is required'); return false }
        if (!maritalStatus) { setError('Marital Status is required'); return false }
        // Validate age >= 18
        const dob = new Date(dateOfBirth)
        const today = new Date()
        const age = today.getFullYear() - dob.getFullYear()
        if (age < 18) { setError('You must be at least 18 years old'); return false }
        return true

      case 2:
        if (!dateOfBaptism.trim()) { setError('Date of Baptism is required'); return false }
        if (!dateJoined.trim()) { setError('Date Joined is required'); return false }
        return true

      case 3:
        if (!district) { setError('District is required'); return false }
        if (selectedGroups.length === 0) { setError('Select at least one group'); return false }
        return true

      case 4:
        if (!primaryPhone.trim()) { setError('Primary Phone is required'); return false }
        // Validate Kenyan phone format
        const phoneRegex = /^(\+254|254|07)\d{8}$/
        if (!phoneRegex.test(primaryPhone.replace(/\s/g, ''))) {
          setError('Invalid phone format. Use: +254712345678 or 0712345678')
          return false
        }
        if (!email.trim()) { setError('Email is required'); return false }
        if (!emergencyContactName.trim()) { setError('Emergency Contact Name is required'); return false }
        if (!emergencyContactPhone.trim()) { setError('Emergency Contact Phone is required'); return false }
        if (!emergencyContactRelationship.trim()) { setError('Emergency Contact Relationship is required'); return false }
        return true

      case 5:
        if (hasChildren === 'Yes' && children.length === 0) {
          setError('Add at least one child or select "No"')
          return false
        }
        return true

      case 6:
        if (!username.trim()) { setError('Username is required'); return false }
        if (username.length < 4) { setError('Username must be at least 4 characters'); return false }
        if (!/^[a-zA-Z0-9_]+$/.test(username)) { setError('Username can only contain letters, numbers, and underscores'); return false }
        if (!password) { setError('Password is required'); return false }
        if (password.length < 8) { setError('Password must be at least 8 characters'); return false }
        if (!/\d/.test(password)) { setError('Password must contain at least one number'); return false }
        if (!/[A-Z]/.test(password)) { setError('Password must contain at least one uppercase letter'); return false }
        if (password !== confirmPassword) { setError('Passwords do not match'); return false }
        if (!securityQuestion) { setError('Security Question is required'); return false }
        if (!securityAnswer.trim()) { setError('Security Answer is required'); return false }
        return true

      case 7:
        if (!dataPrivacyConsent) { setError('You must accept the Data Privacy Consent'); return false }
        return true

      default:
        return true
    }
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    setCurrentStep(currentStep - 1)
    setError('')
  }

  const handleRegister = async () => {
    if (!validateStep(6) || !validateStep(7)) return

    setIsLoading(true)
    setError('')

    try {
      // Sign up with auth
      await signUp(email, password, fullName)
      
      // Get current user
      const currentUser = await blink.auth.me()
      
      if (currentUser) {
        // Create member record with all fields
        const memberData = {
          userId: currentUser.id,
          username,
          fullName,
          preferredName: preferredName || null,
          email,
          phone: primaryPhone,
          secondaryPhone: secondaryPhone || null,
          alternativeEmail: alternativeEmail || null,
          gender,
          dateOfBirth,
          nationalId,
          maritalStatus,
          weddingAnniversary: weddingAnniversary || null,
          occupation: occupation || null,
          employer: employer || null,
          residence: physicalAddress,
          subLocation: subLocation || null,
          location: district,
          dateOfBaptism,
          baptismCertificateNumber: baptismCertificateNumber || null,
          isFullMember: isFullMember === 'Full Member' ? '1' : '0',
          baptismPlace: null,
          confirmationDate: null,
          previousChurch: previousChurch || null,
          dateJoined,
          spiritualGifts: JSON.stringify(spiritualGifts),
          areasToServe: JSON.stringify(areasToServe),
          district,
          cellGroup: null,
          groups: JSON.stringify(selectedGroups),
          leadershipRole: leadershipRole || null,
          dateJoinedGroup: dateJoinedGroup || null,
          emergencyContactName,
          emergencyContactPhone,
          emergencyContactRelationship,
          spouseName: spouseName || null,
          spouseIsMember: spouseIsMember || null,
          familyHead: familyHead || null,
          username,
          securityQuestion,
          securityAnswer, // In production, hash this!
          receiveSms: receiveSms ? '1' : '0',
          receiveEmail: receiveEmail ? '1' : '0',
          notificationCategories: JSON.stringify(selectedNotificationCategories),
          preferredLanguage,
          dataPrivacyConsent: dataPrivacyConsent ? '1' : '0',
          photoReleaseConsent: photoReleaseConsent ? '1' : '0',
          createdAt: new Date().toISOString(),
        }
        
        await blink.db.members.create(memberData)

        // Save children if any
        if (hasChildren === 'Yes') {
          for (const child of children) {
            await blink.db.children.create({
              parentId: currentUser.id,
              fullName: child.fullName,
              dateOfBirth: child.dateOfBirth || null,
              baptized: child.isBaptized === 'Yes' ? '1' : child.isBaptized === 'Pending' ? '0' : '0',
              schoolName: child.group,
              grade: child.group,
            })
          }
        }
      }
      
      Alert.alert(
        'Registration Successful!',
        'Welcome to PCEA Nyarugumu. Please check your email to verify your account.',
        [{ text: 'OK', onPress: () => router.replace('/auth/login') }]
      )
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Render sections
  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      {[1, 2, 3, 4, 5, 6, 7].map((step) => (
        <View key={step} style={styles.stepItem}>
          <View style={[
            styles.stepCircle,
            currentStep >= step && styles.stepCircleActive,
            currentStep === step && styles.stepCircleCurrent
          ]}>
            <Text style={[
              styles.stepNumber,
              currentStep >= step && styles.stepNumberActive
            ]}>{step}</Text>
          </View>
          {step < 7 && (
            <View style={[styles.stepLine, currentStep > step && styles.stepLineActive]} />
          )}
        </View>
      ))}
    </View>
  )

  const renderSection1 = () => (
    <View>
      <Text style={styles.sectionTitle}>Section 1: Personal Information</Text>
      
      <Input
        label="Full Name *"
        value={fullName}
        onChangeText={setFullName}
        placeholder="As per National ID"
        leftIcon={<Ionicons name="person-outline" size={20} color={colors.textSecondary} />}
      />

      <Input
        label="Preferred Name"
        value={preferredName}
        onChangeText={setPreferredName}
        placeholder="What you'd like to be called"
        leftIcon={<Ionicons name="person-outline" size={20} color={colors.textSecondary} />}
      />

      <Input
        label="Date of Birth * (DD/MM/YYYY)"
        value={dateOfBirth}
        onChangeText={setDateOfBirth}
        placeholder="DD/MM/YYYY"
        leftIcon={<Ionicons name="calendar-outline" size={20} color={colors.textSecondary} />}
      />

      <Text style={styles.label}>Gender *</Text>
      <View style={styles.chipContainer}>
        {['Male', 'Female'].map((g) => (
          <TouchableOpacity
            key={g}
            style={[styles.chip, gender === g && styles.chipActive]}
            onPress={() => setGender(g)}
          >
            <Text style={[styles.chipText, gender === g && styles.chipTextActive]}>{g}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Input
        label="National ID / Passport *"
        value={nationalId}
        onChangeText={setNationalId}
        placeholder="Enter ID number"
        leftIcon={<Ionicons name="card-outline" size={20} color={colors.textSecondary} />}
      />

      <Text style={styles.label}>Marital Status *</Text>
      <View style={styles.chipContainer}>
        {['Single', 'Married', 'Widowed', 'Divorced'].map((s) => (
          <TouchableOpacity
            key={s}
            style={[styles.chip, maritalStatus === s && styles.chipActive]}
            onPress={() => setMaritalStatus(s)}
          >
            <Text style={[styles.chipText, maritalStatus === s && styles.chipTextActive]}>{s}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {maritalStatus === 'Married' && (
        <Input
          label="Wedding Anniversary"
          value={weddingAnniversary}
          onChangeText={setWeddingAnniversary}
          placeholder="DD/MM/YYYY"
          leftIcon={<Ionicons name="heart-outline" size={20} color={colors.textSecondary} />}
        />
      )}

      <Input
        label="Occupation"
        value={occupation}
        onChangeText={setOccupation}
        placeholder="Your profession"
        leftIcon={<Ionicons name="briefcase-outline" size={20} color={colors.textSecondary} />}
      />

      <Input
        label="Place of Work / Employment"
        value={employer}
        onChangeText={setEmployer}
        placeholder="Where you work"
        leftIcon={<Ionicons name="business-outline" size={20} color={colors.textSecondary} />}
      />
    </View>
  )

  const renderSection2 = () => (
    <View>
      <Text style={styles.sectionTitle}>Section 2: Church Membership Details</Text>

      <Input
        label="Date of Baptism * (DD/MM/YYYY)"
        value={dateOfBaptism}
        onChangeText={setDateOfBaptism}
        placeholder="DD/MM/YYYY"
        leftIcon={<Ionicons name="water-outline" size={20} color={colors.textSecondary} />}
      />

      <Input
        label="Baptism Certificate Number"
        value={baptismCertificateNumber}
        onChangeText={setBaptismCertificateNumber}
        placeholder="If available"
        leftIcon={<Ionicons name="document-text-outline" size={20} color={colors.textSecondary} />}
      />

      <Text style={styles.label}>Membership Status *</Text>
      <View style={styles.chipContainer}>
        {['Full Member', 'Not Full Member'].map((s) => (
          <TouchableOpacity
            key={s}
            style={[styles.chip, isFullMember === s && styles.chipActive]}
            onPress={() => setIsFullMember(s)}
          >
            <Text style={[styles.chipText, isFullMember === s && styles.chipTextActive]}>{s}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Input
        label="Previous Church"
        value={previousChurch}
        onChangeText={setPreviousChurch}
        placeholder="If transferred from elsewhere"
        leftIcon={<Ionicons name="church-outline" size={20} color={colors.textSecondary} />}
      />

      <Input
        label="Date Joined This Church * (DD/MM/YYYY)"
        value={dateJoined}
        onChangeText={setDateJoined}
        placeholder="DD/MM/YYYY"
        leftIcon={<Ionicons name="calendar-outline" size={20} color={colors.textSecondary} />}
      />

      <Text style={styles.label}>Spiritual Gifts (Select all that apply)</Text>
      <View style={styles.chipContainer}>
        {SPIRITUAL_GIFTS.map((gift) => (
          <TouchableOpacity
            key={gift}
            style={[styles.chipSmall, spiritualGifts.includes(gift) && styles.chipActive]}
            onPress={() => toggleItem(gift, spiritualGifts, setSpiritualGifts)}
          >
            <Text style={[styles.chipTextSmall, spiritualGifts.includes(gift) && styles.chipTextActive]}>
              {gift}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Areas Willing to Serve (Select all that apply)</Text>
      <View style={styles.chipContainer}>
        {AREAS_TO_SERVE.map((area) => (
          <TouchableOpacity
            key={area}
            style={[styles.chipSmall, areasToServe.includes(area) && styles.chipActive]}
            onPress={() => toggleItem(area, areasToServe, setAreasToServe)}
          >
            <Text style={[styles.chipTextSmall, areasToServe.includes(area) && styles.chipTextActive]}>
              {area}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  )

  const renderSection3 = () => (
    <View>
      <Text style={styles.sectionTitle}>Section 3: District & Group Participation</Text>

      <Text style={styles.label}>District *</Text>
      <View style={styles.chipContainer}>
        {DISTRICTS.map((d) => (
          <TouchableOpacity
            key={d}
            style={[styles.chip, district === d && styles.chipActive]}
            onPress={() => setDistrict(d)}
          >
            <Text style={[styles.chipText, district === d && styles.chipTextActive]}>
              {d.replace(' District', '')}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Input
        label="Sub-Location/Zone"
        value={subLocation}
        onChangeText={setSubLocation}
        placeholder="For finer filtering"
        leftIcon={<Ionicons name="location-outline" size={20} color={colors.textSecondary} />}
      />

      <Text style={styles.label}>Groups Participating * (Select all that apply)</Text>
      <View style={styles.chipContainer}>
        {GROUPS.map((g) => (
          <TouchableOpacity
            key={g}
            style={[styles.chipSmall, selectedGroups.includes(g) && styles.chipActive]}
            onPress={() => toggleItem(g, selectedGroups, setSelectedGroups)}
          >
            <Text style={[styles.chipTextSmall, selectedGroups.includes(g) && styles.chipTextActive]}>
              {g}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Leadership Role</Text>
      <View style={styles.chipContainer}>
        {LEADERSHIP_ROLES.map((r) => (
          <TouchableOpacity
            key={r}
            style={[styles.chip, leadershipRole === r && styles.chipActive]}
            onPress={() => setLeadershipRole(r)}
          >
            <Text style={[styles.chipText, leadershipRole === r && styles.chipTextActive]}>{r}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {leadershipRole && leadershipRole !== 'None' && (
        <Input
          label="Date Joined Group (DD/MM/YYYY)"
          value={dateJoinedGroup}
          onChangeText={setDateJoinedGroup}
          placeholder="DD/MM/YYYY"
          leftIcon={<Ionicons name="calendar-outline" size={20} color={colors.textSecondary} />}
        />
      )}
    </View>
  )

  const renderSection4 = () => (
    <View>
      <Text style={styles.sectionTitle}>Section 4: Contact Information</Text>

      <Input
        label="Primary Phone Number * (+254 XXX XXX XXX)"
        value={primaryPhone}
        onChangeText={setPrimaryPhone}
        placeholder="254712345678"
        keyboardType="phone-pad"
        leftIcon={<Ionicons name="call-outline" size={20} color={colors.textSecondary} />}
      />

      <Input
        label="Secondary Phone Number"
        value={secondaryPhone}
        onChangeText={setSecondaryPhone}
        placeholder="254798765432"
        keyboardType="phone-pad"
        leftIcon={<Ionicons name="call-outline" size={20} color={colors.textSecondary} />}
      />

      <Input
        label="Email Address *"
        value={email}
        onChangeText={setEmail}
        placeholder="name@example.com"
        keyboardType="email-address"
        autoCapitalize="none"
        leftIcon={<Ionicons name="mail-outline" size={20} color={colors.textSecondary} />}
      />

      <Input
        label="Alternative Email"
        value={alternativeEmail}
        onChangeText={setAlternativeEmail}
        placeholder="name@example.com"
        keyboardType="email-address"
        autoCapitalize="none"
        leftIcon={<Ionicons name="mail-outline" size={20} color={colors.textSecondary} />}
      />

      <Input
        label="Postal Address"
        value={postalAddress}
        onChangeText={setPostalAddress}
        placeholder="P.O. Box xxx, City"
        leftIcon={<Ionicons name="mail-outline" size={20} color={colors.textSecondary} />}
      />

      <Input
        label="Physical Address"
        value={physicalAddress}
        onChangeText={setPhysicalAddress}
        placeholder="Your physical address"
        multiline
        leftIcon={<Ionicons name="location-outline" size={20} color={colors.textSecondary} />}
      />

      <Text style={styles.divider}>Emergency Contact *</Text>

      <Input
        label="Emergency Contact Name *"
        value={emergencyContactName}
        onChangeText={setEmergencyContactName}
        placeholder="Full name"
        leftIcon={<Ionicons name="person-outline" size={20} color={colors.textSecondary} />}
      />

      <Input
        label="Emergency Contact Phone *"
        value={emergencyContactPhone}
        onChangeText={setEmergencyContactPhone}
        placeholder="254712345678"
        keyboardType="phone-pad"
        leftIcon={<Ionicons name="call-outline" size={20} color={colors.textSecondary} />}
      />

      <Input
        label="Emergency Contact Relationship *"
        value={emergencyContactRelationship}
        onChangeText={setEmergencyContactRelationship}
        placeholder="e.g., Spouse, Parent, Sibling"
        leftIcon={<Ionicons name="heart-outline" size={20} color={colors.textSecondary} />}
      />
    </View>
  )

  const renderSection5 = () => (
    <View>
      <Text style={styles.sectionTitle}>Section 5: Family Information</Text>

      <Text style={styles.label}>Do you have children? *</Text>
      <View style={styles.chipContainer}>
        {['Yes', 'No'].map((s) => (
          <TouchableOpacity
            key={s}
            style={[styles.chip, hasChildren === s && styles.chipActive]}
            onPress={() => { setHasChildren(s); if (s === 'No') setChildren([]) }}
          >
            <Text style={[styles.chipText, hasChildren === s && styles.chipTextActive]}>{s}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {hasChildren === 'Yes' && (
        <>
          {children.map((child, index) => (
            <Card key={child.id} variant="outlined" style={styles.childCard}>
              <View style={styles.childHeader}>
                <Text style={styles.childTitle}>Child #{index + 1}</Text>
                <TouchableOpacity onPress={() => removeChild(child.id)}>
                  <Ionicons name="trash-outline" size={20} color={colors.error} />
                </TouchableOpacity>
              </View>

              <Input
                label="Full Name"
                value={child.fullName}
                onChangeText={(v) => updateChild(child.id, 'fullName', v)}
                placeholder="Child's full name"
              />

              <Input
                label="Date of Birth"
                value={child.dateOfBirth}
                onChangeText={(v) => updateChild(child.id, 'dateOfBirth', v)}
                placeholder="DD/MM/YYYY"
              />

              <Text style={styles.label}>Is Baptized?</Text>
              <View style={styles.chipContainer}>
                {['Yes', 'No', 'Pending'].map((s) => (
                  <TouchableOpacity
                    key={s}
                    style={[styles.chipSmall, child.isBaptized === s && styles.chipActive]}
                    onPress={() => updateChild(child.id, 'isBaptized', s)}
                  >
                    <Text style={[styles.chipTextSmall, child.isBaptized === s && styles.chipTextActive]}>
                      {s}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.label}>Child Group</Text>
              <View style={styles.chipContainer}>
                {CHILD_GROUPS.map((g) => (
                  <TouchableOpacity
                    key={g}
                    style={[styles.chipSmall, child.group === g && styles.chipActive]}
                    onPress={() => updateChild(child.id, 'group', g)}
                  >
                    <Text style={[styles.chipTextSmall, child.group === g && styles.chipTextActive]}>
                      {g}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </Card>
          ))}

          <Button variant="outline" onPress={addChild} style={styles.addChildBtn}>
            <Ionicons name="add" size={20} color={colors.primary} />
            <Text style={styles.addChildBtnText}>Add Another Child</Text>
          </Button>
        </>
      )}

      {maritalStatus === 'Married' && (
        <>
          <Text style={styles.divider}>Spouse Information</Text>

          <Input
            label="Spouse Name"
            value={spouseName}
            onChangeText={setSpouseName}
            placeholder="Spouse's full name"
            leftIcon={<Ionicons name="person-outline" size={20} color={colors.textSecondary} />}
          />

          <Text style={styles.label}>Spouse Is Member Here?</Text>
          <View style={styles.chipContainer}>
            {['Yes', 'No'].map((s) => (
              <TouchableOpacity
                key={s}
                style={[styles.chip, spouseIsMember === s && styles.chipActive]}
                onPress={() => setSpouseIsMember(s)}
              >
                <Text style={[styles.chipText, spouseIsMember === s && styles.chipTextActive]}>{s}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}

      <Text style={styles.label}>Family Head</Text>
      <View style={styles.chipContainer}>
        {['Yes', 'No'].map((s) => (
          <TouchableOpacity
            key={s}
            style={[styles.chip, familyHead === s && styles.chipActive]}
            onPress={() => setFamilyHead(s)}
          >
            <Text style={[styles.chipText, familyHead === s && styles.chipTextActive]}>{s}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  )

  const renderSection6 = () => (
    <View>
      <Text style={styles.sectionTitle}>Section 6: Login Credentials</Text>

      <Input
        label="Username *"
        value={username}
        onChangeText={setUsername}
        placeholder="Choose a username"
        autoCapitalize="none"
        leftIcon={<Ionicons name="person-outline" size={20} color={colors.textSecondary} />}
      />

      <Input
        label="Password * (Min 8 chars with letters & numbers)"
        value={password}
        onChangeText={setPassword}
        placeholder="Create a password"
        secureTextEntry
        leftIcon={<Ionicons name="lock-closed-outline" size={20} color={colors.textSecondary} />}
      />

      <Input
        label="Confirm Password *"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholder="Confirm your password"
        secureTextEntry
        leftIcon={<Ionicons name="lock-closed-outline" size={20} color={colors.textSecondary} />}
      />

      <Text style={styles.label}>Security Question *</Text>
      <View style={styles.chipContainer}>
        {SECURITY_QUESTIONS.map((q) => (
          <TouchableOpacity
            key={q}
            style={[styles.chip, securityQuestion === q && styles.chipActive]}
            onPress={() => setSecurityQuestion(q)}
          >
            <Text style={[styles.chipTextSmall, securityQuestion === q && styles.chipTextActive]}>
              {q}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Input
        label="Security Answer *"
        value={securityAnswer}
        onChangeText={setSecurityAnswer}
        placeholder="Your answer"
        leftIcon={<Ionicons name="help-circle-outline" size={20} color={colors.textSecondary} />}
      />
    </View>
  )

  const renderSection7 = () => (
    <View>
      <Text style={styles.sectionTitle}>Section 7: Preferences & Consent</Text>

      <View style={styles.toggleRow}>
        <View style={styles.toggleInfo}>
          <Text style={styles.toggleLabel}>Receive SMS Notifications</Text>
          <Text style={styles.toggleDesc}>Get updates via SMS</Text>
        </View>
        <Switch
          value={receiveSms}
          onValueChange={setReceiveSms}
          trackColor={{ false: colors.border, true: colors.primary }}
        />
      </View>

      <View style={styles.toggleRow}>
        <View style={styles.toggleInfo}>
          <Text style={styles.toggleLabel}>Receive Email Notifications</Text>
          <Text style={styles.toggleDesc}>Get updates via email</Text>
        </View>
        <Switch
          value={receiveEmail}
          onValueChange={setReceiveEmail}
          trackColor={{ false: colors.border, true: colors.primary }}
        />
      </View>

      <Text style={styles.label}>Notification Categories (Select all that apply)</Text>
      <View style={styles.chipContainer}>
        {NOTIFICATION_CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[styles.chipSmall, selectedNotificationCategories.includes(cat) && styles.chipActive]}
            onPress={() => toggleItem(cat, selectedNotificationCategories, setSelectedNotificationCategories)}
          >
            <Text style={[styles.chipTextSmall, selectedNotificationCategories.includes(cat) && styles.chipTextActive]}>
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Preferred Language *</Text>
      <View style={styles.chipContainer}>
        {LANGUAGES.map((lang) => (
          <TouchableOpacity
            key={lang}
            style={[styles.chip, preferredLanguage === lang && styles.chipActive]}
            onPress={() => setPreferredLanguage(lang)}
          >
            <Text style={[styles.chipText, preferredLanguage === lang && styles.chipTextActive]}>{lang}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.consentSection}>
        <TouchableOpacity
          style={styles.consentRow}
          onPress={() => setDataPrivacyConsent(!dataPrivacyConsent)}
        >
          <Ionicons
            name={dataPrivacyConsent ? 'checkbox' : 'square-outline'}
            size={24}
            color={dataPrivacyConsent ? colors.primary : colors.textSecondary}
          />
          <Text style={styles.consentText}>
            I agree to data storage and processing *
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.consentRow}
          onPress={() => setPhotoReleaseConsent(!photoReleaseConsent)}
        >
          <Ionicons
            name={photoReleaseConsent ? 'checkbox' : 'square-outline'}
            size={24}
            color={photoReleaseConsent ? colors.primary : colors.textSecondary}
          />
          <Text style={styles.consentText}>
            Allow photos in church communications
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )

  return (
    <Container safeArea edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Ionicons name="church" size={48} color={colors.primary} />
            </View>
            <Text style={styles.title}>PCEA Nyarugumu</Text>
            <Text style={styles.subtitle}>Member Registration</Text>
          </View>

          {renderStepIndicator()}

          {error ? (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle" size={20} color={colors.error} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <Card variant="elevated" style={styles.card}>
            <Card.Content>
              {currentStep === 1 && renderSection1()}
              {currentStep === 2 && renderSection2()}
              {currentStep === 3 && renderSection3()}
              {currentStep === 4 && renderSection4()}
              {currentStep === 5 && renderSection5()}
              {currentStep === 6 && renderSection6()}
              {currentStep === 7 && renderSection7()}
            </Card.Content>

            <Card.Footer style={styles.footer}>
              {currentStep > 1 && (
                <Button variant="outline" onPress={handleBack} style={styles.navButton}>
                  Back
                </Button>
              )}
              
              {currentStep < totalSteps ? (
                <Button variant="primary" onPress={handleNext} style={styles.navButton}>
                  Next
                </Button>
              ) : (
                <Button
                  variant="primary"
                  onPress={handleRegister}
                  loading={isLoading}
                  style={styles.navButton}
                >
                  Complete Registration
                </Button>
              )}
            </Card.Footer>
          </Card>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <Button variant="ghost" onPress={() => router.push('/auth/login')}>
              Sign In
            </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Container>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
  },
  header: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primaryTint,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  title: {
    ...typography.h2,
    color: colors.text,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
  },
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
  },
  stepCircleActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  stepCircleCurrent: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  stepNumber: {
    ...typography.captionBold,
    color: colors.textSecondary,
  },
  stepNumberActive: {
    color: colors.white,
  },
  stepLine: {
    width: 24,
    height: 2,
    backgroundColor: colors.border,
    marginHorizontal: 4,
  },
  stepLineActive: {
    backgroundColor: colors.primary,
  },
  card: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.primary,
    marginBottom: spacing.lg,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  label: {
    ...typography.bodyBold,
    color: colors.text,
    marginBottom: spacing.sm,
    marginTop: spacing.sm,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    ...typography.caption,
    color: colors.text,
  },
  chipTextActive: {
    color: colors.white,
  },
  chipSmall: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  chipTextSmall: {
    ...typography.small,
    color: colors.text,
  },
  childCard: {
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  childHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  childTitle: {
    ...typography.bodyBold,
    color: colors.primary,
  },
  addChildBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.sm,
  },
  addChildBtnText: {
    ...typography.bodyBold,
    color: colors.primary,
    marginLeft: spacing.xs,
  },
  divider: {
    ...typography.h4,
    color: colors.text,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  toggleInfo: {
    flex: 1,
  },
  toggleLabel: {
    ...typography.bodyBold,
    color: colors.text,
  },
  toggleDesc: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  consentSection: {
    marginTop: spacing.lg,
  },
  consentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  consentText: {
    ...typography.body,
    color: colors.text,
    marginLeft: spacing.sm,
    flex: 1,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.errorTint,
    padding: spacing.md,
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    borderRadius: borderRadius.md,
  },
  errorText: {
    ...typography.body,
    color: colors.error,
    marginLeft: spacing.sm,
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  navButton: {
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  footerText: {
    ...typography.body,
    color: colors.textSecondary,
  },
})
