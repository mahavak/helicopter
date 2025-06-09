/**
 * TestFlight Test Suite Runner
 * Comprehensive test orchestration and reporting
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class TestSuiteRunner {
    constructor() {
        this.results = {
            comprehensive: null,
            integration: null,
            performance: null,
            summary: {
                totalTests: 0,
                passedTests: 0,
                failedTests: 0,
                coverage: 0,
                duration: 0
            }
        };
        this.startTime = Date.now();
    }

    log(message, level = 'info') {
        const timestamp = new Date().toISOString();
        const prefix = {
            info: '📊',
            success: '✅',
            error: '❌',
            warning: '⚠️'
        }[level] || '📊';
        
        console.log(`${prefix} [${timestamp}] ${message}`);
        
        // Also write to log file
        const logMessage = `[${timestamp}] ${level.toUpperCase()}: ${message}\n`;
        fs.appendFileSync('/app/logs/test-suite.log', logMessage);
    }

    async runTestSuite(suiteName, command, description) {
        this.log(`Starting ${suiteName} - ${description}`);
        
        try {
            const startTime = Date.now();
            const output = execSync(command, {
                encoding: 'utf8',
                maxBuffer: 1024 * 1024 * 10, // 10MB buffer
                timeout: 300000 // 5 minutes timeout
            });
            
            const endTime = Date.now();
            const duration = endTime - startTime;
            
            this.log(`${suiteName} completed successfully in ${duration}ms`, 'success');
            
            // Parse test results from output
            const testResults = this.parseTestOutput(output);
            testResults.duration = duration;
            testResults.output = output;
            
            return testResults;
            
        } catch (error) {
            this.log(`${suiteName} failed: ${error.message}`, 'error');
            
            return {
                success: false,
                error: error.message,
                output: error.stdout || error.stderr || '',
                duration: 0
            };
        }
    }

    parseTestOutput(output) {
        const results = {
            success: true,
            totalTests: 0,
            passedTests: 0,
            failedTests: 0,
            coverage: 0,
            details: []
        };

        try {
            // Extract test summary
            const testSummaryMatch = output.match(/Tests:\s+(\d+)\s+failed,\s+(\d+)\s+passed,\s+(\d+)\s+total/);
            if (testSummaryMatch) {
                results.failedTests = parseInt(testSummaryMatch[1]);
                results.passedTests = parseInt(testSummaryMatch[2]);
                results.totalTests = parseInt(testSummaryMatch[3]);
                results.success = results.failedTests === 0;
            }

            // Extract coverage
            const coverageMatch = output.match(/All files\s+\|\s+([\d.]+)/);
            if (coverageMatch) {
                results.coverage = parseFloat(coverageMatch[1]);
            }

            // Extract individual test results
            const testLines = output.split('\n').filter(line => 
                line.includes('✓') || line.includes('✕') || line.includes('PASS') || line.includes('FAIL')
            );
            
            results.details = testLines.map(line => ({
                status: line.includes('✓') || line.includes('PASS') ? 'passed' : 'failed',
                description: line.trim()
            }));

        } catch (parseError) {
            this.log(`Error parsing test output: ${parseError.message}`, 'warning');
        }

        return results;
    }

    generateDetailedReport() {
        const report = {
            timestamp: new Date().toISOString(),
            duration: Date.now() - this.startTime,
            environment: {
                node: process.version,
                platform: process.platform,
                architecture: process.arch,
                memory: process.memoryUsage(),
                docker: true
            },
            testSuites: this.results,
            summary: this.results.summary
        };

        const reportJson = JSON.stringify(report, null, 2);
        fs.writeFileSync('/app/test-results/detailed-report.json', reportJson);
        
        // Generate human-readable report
        const humanReport = this.generateHumanReport(report);
        fs.writeFileSync('/app/test-results/test-report.md', humanReport);
        
        return report;
    }

    generateHumanReport(report) {
        const duration = (report.duration / 1000).toFixed(2);
        
        return `# TestFlight Comprehensive Test Report

## 🚁 Matrix Helicopter TestFlight Test Results

**Generated:** ${report.timestamp}  
**Duration:** ${duration} seconds  
**Environment:** Node.js ${report.environment.node} on ${report.environment.platform}

## 📊 Test Summary

| Suite | Tests | Passed | Failed | Coverage | Duration |
|-------|-------|--------|--------|----------|----------|
| **Comprehensive** | ${report.testSuites.comprehensive?.totalTests || 0} | ${report.testSuites.comprehensive?.passedTests || 0} | ${report.testSuites.comprehensive?.failedTests || 0} | ${report.testSuites.comprehensive?.coverage || 0}% | ${(report.testSuites.comprehensive?.duration || 0) / 1000}s |
| **Integration** | ${report.testSuites.integration?.totalTests || 0} | ${report.testSuites.integration?.passedTests || 0} | ${report.testSuites.integration?.failedTests || 0} | ${report.testSuites.integration?.coverage || 0}% | ${(report.testSuites.integration?.duration || 0) / 1000}s |
| **Performance** | ${report.testSuites.performance?.totalTests || 0} | ${report.testSuites.performance?.passedTests || 0} | ${report.testSuites.performance?.failedTests || 0} | ${report.testSuites.performance?.coverage || 0}% | ${(report.testSuites.performance?.duration || 0) / 1000}s |

## 🎯 Overall Results

- **Total Tests:** ${report.summary.totalTests}
- **Passed:** ${report.summary.passedTests} ✅
- **Failed:** ${report.summary.failedTests} ${report.summary.failedTests > 0 ? '❌' : '✅'}
- **Success Rate:** ${report.summary.totalTests > 0 ? ((report.summary.passedTests / report.summary.totalTests) * 100).toFixed(1) : 0}%
- **Average Coverage:** ${report.summary.coverage.toFixed(1)}%

## 🧪 Test Details

${this.generateSuiteDetails('Comprehensive Tests', report.testSuites.comprehensive)}

${this.generateSuiteDetails('Integration Tests', report.testSuites.integration)}

${this.generateSuiteDetails('Performance Tests', report.testSuites.performance)}

## 🔧 Environment Details

- **Node.js Version:** ${report.environment.node}
- **Platform:** ${report.environment.platform} (${report.environment.architecture})
- **Memory Usage:** ${(report.environment.memory.heapUsed / 1024 / 1024).toFixed(2)}MB heap
- **Docker Environment:** ${report.environment.docker ? 'Yes' : 'No'}

## 📈 Recommendations

${this.generateRecommendations(report)}

---
*Generated by Matrix Helicopter TestFlight Test Suite*
`;
    }

    generateSuiteDetails(suiteName, results) {
        if (!results) {
            return `### ${suiteName}
*Not executed*
`;
        }

        const status = results.success ? '✅ PASSED' : '❌ FAILED';
        const duration = (results.duration / 1000).toFixed(2);

        return `### ${suiteName} ${status}

**Duration:** ${duration}s  
**Tests:** ${results.totalTests} total, ${results.passedTests} passed, ${results.failedTests} failed  
**Coverage:** ${results.coverage}%

${results.details && results.details.length > 0 ? 
    results.details.slice(0, 10).map(detail => 
        `- ${detail.status === 'passed' ? '✅' : '❌'} ${detail.description}`
    ).join('\n') + (results.details.length > 10 ? `\n... and ${results.details.length - 10} more tests` : '')
    : '*No detailed results available*'
}
`;
    }

    generateRecommendations(report) {
        const recommendations = [];

        if (report.summary.failedTests > 0) {
            recommendations.push('🔧 **Fix failing tests** - Some tests are failing and need attention');
        }

        if (report.summary.coverage < 80) {
            recommendations.push('📊 **Improve test coverage** - Current coverage is below 80%');
        }

        if (report.duration > 60000) {
            recommendations.push('⚡ **Optimize test performance** - Test suite is taking longer than 1 minute');
        }

        const performanceResults = report.testSuites.performance;
        if (performanceResults && performanceResults.failedTests > 0) {
            recommendations.push('🏃 **Address performance issues** - Some performance tests are failing');
        }

        if (recommendations.length === 0) {
            recommendations.push('🎉 **All tests passing!** - The TestFlight feature is working excellently');
            recommendations.push('🚀 **Ready for deployment** - All quality checks passed');
        }

        return recommendations.join('\n');
    }

    async run() {
        this.log('🚁 Starting Matrix Helicopter TestFlight Comprehensive Test Suite');
        
        // Ensure log directory exists
        const logDir = '/app/logs';
        if (!fs.existsSync(logDir)) {
            fs.mkdirSync(logDir, { recursive: true });
        }

        // Ensure test results directory exists
        const resultsDir = '/app/test-results';
        if (!fs.existsSync(resultsDir)) {
            fs.mkdirSync(resultsDir, { recursive: true });
        }

        // Clear previous logs
        const logFile = path.join(logDir, 'test-suite.log');
        if (fs.existsSync(logFile)) {
            fs.unlinkSync(logFile);
        }

        this.log('🧪 Test environment prepared');

        // Run comprehensive tests
        this.results.comprehensive = await this.runTestSuite(
            'Comprehensive Tests',
            'npm run test -- tests/features/TestFlightComprehensive.test.js',
            'Core TestFlight functionality and features'
        );

        // Update summary
        if (this.results.comprehensive) {
            this.results.summary.totalTests += this.results.comprehensive.totalTests || 0;
            this.results.summary.passedTests += this.results.comprehensive.passedTests || 0;
            this.results.summary.failedTests += this.results.comprehensive.failedTests || 0;
        }

        // Run integration tests
        this.results.integration = await this.runTestSuite(
            'Integration Tests',
            'npm run test -- tests/integration/TestFlightIntegration.test.js',
            'Integration with game systems and components'
        );

        // Update summary
        if (this.results.integration) {
            this.results.summary.totalTests += this.results.integration.totalTests || 0;
            this.results.summary.passedTests += this.results.integration.passedTests || 0;
            this.results.summary.failedTests += this.results.integration.failedTests || 0;
        }

        // Run performance tests
        this.results.performance = await this.runTestSuite(
            'Performance Tests',
            'npm run test -- tests/performance/TestFlightPerformance.test.js',
            'Performance benchmarks and stress testing'
        );

        // Update summary
        if (this.results.performance) {
            this.results.summary.totalTests += this.results.performance.totalTests || 0;
            this.results.summary.passedTests += this.results.performance.passedTests || 0;
            this.results.summary.failedTests += this.results.performance.failedTests || 0;
        }

        // Calculate average coverage
        const coverageValues = [
            this.results.comprehensive?.coverage || 0,
            this.results.integration?.coverage || 0,
            this.results.performance?.coverage || 0
        ].filter(val => val > 0);
        
        this.results.summary.coverage = coverageValues.length > 0 
            ? coverageValues.reduce((a, b) => a + b, 0) / coverageValues.length 
            : 0;

        this.results.summary.duration = Date.now() - this.startTime;

        // Generate detailed report
        const report = this.generateDetailedReport();

        // Log final summary
        this.log('📋 Test Suite Summary:', 'info');
        this.log(`   Total Tests: ${this.results.summary.totalTests}`, 'info');
        this.log(`   Passed: ${this.results.summary.passedTests}`, this.results.summary.passedTests > 0 ? 'success' : 'info');
        this.log(`   Failed: ${this.results.summary.failedTests}`, this.results.summary.failedTests > 0 ? 'error' : 'success');
        this.log(`   Coverage: ${this.results.summary.coverage.toFixed(1)}%`, 'info');
        this.log(`   Duration: ${(this.results.summary.duration / 1000).toFixed(2)}s`, 'info');

        if (this.results.summary.failedTests === 0) {
            this.log('🎉 All tests passed! TestFlight feature is ready for production', 'success');
        } else {
            this.log(`⚠️ ${this.results.summary.failedTests} test(s) failed - Review and fix issues`, 'warning');
        }

        // Exit with appropriate code
        process.exit(this.results.summary.failedTests > 0 ? 1 : 0);
    }
}

// Run the test suite if this file is executed directly
if (require.main === module) {
    const runner = new TestSuiteRunner();
    runner.run().catch(error => {
        console.error('❌ Test suite failed with error:', error);
        process.exit(1);
    });
}

module.exports = TestSuiteRunner;