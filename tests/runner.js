#!/usr/bin/env node

/**
 * Test Runner Script for Matrixhelicopter
 * Provides comprehensive test execution with detailed logging
 */

import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

class TestRunner {
    constructor() {
        this.logDir = '/app/logs';
        this.testResults = [];
        this.startTime = Date.now();
        
        // Ensure log directory exists
        if (!fs.existsSync(this.logDir)) {
            fs.mkdirSync(this.logDir, { recursive: true });
        }
    }
    
    log(message, level = 'INFO') {
        const timestamp = new Date().toISOString();
        const logMessage = `[${timestamp}] [${level}] ${message}`;
        console.log(logMessage);
        
        // Write to log file
        fs.appendFileSync(
            path.join(this.logDir, 'test-runner.log'),
            logMessage + '\n'
        );
    }
    
    async runTests() {
        this.log('Starting Matrixhelicopter test suite execution');
        this.log(`Environment: ${process.env.NODE_ENV || 'unknown'}`);
        this.log(`Working directory: ${process.cwd()}`);
        
        try {
            // Pre-test validation
            await this.validateEnvironment();
            
            // Run different test suites
            await this.runUnitTests();
            await this.runIntegrationTests();
            await this.generateCoverageReport();
            
            // Post-test analysis
            this.analyzeResults();
            this.generateSummaryReport();
            
        } catch (error) {
            this.log(`Test execution failed: ${error.message}`, 'ERROR');
            this.log(`Stack trace: ${error.stack}`, 'ERROR');
            process.exit(1);
        }
    }
    
    async validateEnvironment() {
        this.log('Validating test environment...');
        
        // Check Node.js version
        this.log(`Node.js version: ${process.version}`);
        
        // Check if required files exist
        const requiredFiles = [
            'package.json',
            'jest.config.js',
            'tests/setup.js'
        ];
        
        for (const file of requiredFiles) {
            if (!fs.existsSync(file)) {
                throw new Error(`Required file missing: ${file}`);
            }
        }
        
        this.log('Environment validation completed');
    }
    
    async runUnitTests() {
        this.log('Running unit tests...');
        
        const unitTestPatterns = [
            'tests/helicopter/*.test.js',
            'tests/audio/*.test.js',
            'tests/environment/*.test.js',
            'tests/systems/*.test.js'
        ];
        
        for (const pattern of unitTestPatterns) {
            await this.executeJest(pattern, 'unit');
        }
    }
    
    async runIntegrationTests() {
        this.log('Running integration tests...');
        await this.executeJest('tests/integration/*.test.js', 'integration');
    }
    
    async executeJest(pattern, testType) {
        return new Promise((resolve, reject) => {
            this.log(`Executing ${testType} tests: ${pattern}`);
            
            const jestArgs = [
                '--testPathPattern=' + pattern,
                '--verbose',
                '--no-cache',
                '--forceExit',
                '--detectOpenHandles',
                '--logHeapUsage'
            ];
            
            const jest = spawn('npx', ['jest', ...jestArgs], {
                stdio: ['pipe', 'pipe', 'pipe'],
                env: { ...process.env, FORCE_COLOR: '0' }
            });
            
            let stdout = '';
            let stderr = '';
            
            jest.stdout.on('data', (data) => {
                const output = data.toString();
                stdout += output;
                console.log(output.trim());
            });
            
            jest.stderr.on('data', (data) => {
                const output = data.toString();
                stderr += output;
                console.error(output.trim());
            });
            
            jest.on('close', (code) => {
                const result = {
                    testType,
                    pattern,
                    exitCode: code,
                    stdout,
                    stderr,
                    timestamp: new Date().toISOString()
                };
                
                this.testResults.push(result);
                
                // Log detailed results
                const logFile = path.join(this.logDir, `${testType}-tests.log`);
                fs.writeFileSync(logFile, JSON.stringify(result, null, 2));
                
                if (code === 0) {
                    this.log(`${testType} tests completed successfully`);
                    resolve(result);
                } else {
                    this.log(`${testType} tests failed with exit code ${code}`, 'ERROR');
                    this.log(`STDERR: ${stderr}`, 'ERROR');
                    resolve(result); // Don't reject to continue with other tests
                }
            });
            
            jest.on('error', (error) => {
                this.log(`Failed to execute ${testType} tests: ${error.message}`, 'ERROR');
                reject(error);
            });
        });
    }
    
    async generateCoverageReport() {
        this.log('Generating coverage report...');
        
        return new Promise((resolve) => {
            const jest = spawn('npx', ['jest', '--coverage', '--coverageReporters=json', '--coverageReporters=text'], {
                stdio: ['pipe', 'pipe', 'pipe']
            });
            
            let coverageOutput = '';
            
            jest.stdout.on('data', (data) => {
                coverageOutput += data.toString();
            });
            
            jest.on('close', (code) => {
                fs.writeFileSync(
                    path.join(this.logDir, 'coverage-output.log'),
                    coverageOutput
                );
                
                this.log(`Coverage report generated (exit code: ${code})`);
                resolve();
            });
        });
    }
    
    analyzeResults() {
        this.log('Analyzing test results...');
        
        const totalTests = this.testResults.length;
        const passedTests = this.testResults.filter(r => r.exitCode === 0).length;
        const failedTests = totalTests - passedTests;
        
        this.log(`Total test suites: ${totalTests}`);
        this.log(`Passed: ${passedTests}`);
        this.log(`Failed: ${failedTests}`);
        
        // Analyze common failure patterns
        const failures = this.testResults.filter(r => r.exitCode !== 0);
        if (failures.length > 0) {
            this.log('Failure analysis:', 'ERROR');
            failures.forEach(failure => {
                this.log(`- ${failure.testType}: ${failure.pattern}`, 'ERROR');
                
                // Extract key error information
                const errorLines = failure.stderr.split('\n')
                    .filter(line => line.includes('Error') || line.includes('Failed'))
                    .slice(0, 3);
                
                errorLines.forEach(line => {
                    this.log(`  ${line.trim()}`, 'ERROR');
                });
            });
        }
    }
    
    generateSummaryReport() {
        const endTime = Date.now();
        const duration = (endTime - this.startTime) / 1000;
        
        const summary = {
            execution: {
                startTime: new Date(this.startTime).toISOString(),
                endTime: new Date(endTime).toISOString(),
                duration: `${duration}s`
            },
            environment: {
                nodeVersion: process.version,
                platform: process.platform,
                arch: process.arch,
                cwd: process.cwd()
            },
            results: {
                totalSuites: this.testResults.length,
                passed: this.testResults.filter(r => r.exitCode === 0).length,
                failed: this.testResults.filter(r => r.exitCode !== 0).length
            },
            details: this.testResults.map(r => ({
                testType: r.testType,
                pattern: r.pattern,
                success: r.exitCode === 0,
                timestamp: r.timestamp
            }))
        };
        
        // Write summary to file
        fs.writeFileSync(
            path.join(this.logDir, 'test-summary.json'),
            JSON.stringify(summary, null, 2)
        );
        
        this.log(`Test execution completed in ${duration}s`);
        this.log(`Summary report saved to: ${path.join(this.logDir, 'test-summary.json')}`);
        
        // Exit with appropriate code
        const hasFailures = this.testResults.some(r => r.exitCode !== 0);
        process.exit(hasFailures ? 1 : 0);
    }
}

// Run the test suite
const runner = new TestRunner();
runner.runTests().catch(error => {
    console.error('Test runner failed:', error);
    process.exit(1);
});