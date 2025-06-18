                                <div className="flex justify-between items-start mb-3">
                                    {/* Placeholder for Company Logo/Icon */}
                                    {console.log('Interview Data:', interview)} 
                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-lg font-bold">
                                        {interview.jobTitle ? interview.jobTitle[0] : ''}
                                    </div>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">{new Date(interview.createdAt).toLocaleDateString()}</span>
                                </div> 