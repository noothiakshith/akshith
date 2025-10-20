const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-primary-600 mb-2">LinguaFr</h1>
          <p className="text-gray-600">Learn French with AI-powered lessons</p>
        </div>
        {children}
      </div>
    </div>
  )
}

export default AuthLayout