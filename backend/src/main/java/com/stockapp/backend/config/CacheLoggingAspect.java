package com.stockapp.backend.config;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Aspect
@Component
public class CacheLoggingAspect {
    private static final Logger logger = LoggerFactory.getLogger(CacheLoggingAspect.class);
    
    @Around("@annotation(org.springframework.cache.annotation.Cacheable)")
    public Object logCacheAccess(ProceedingJoinPoint joinPoint) throws Throwable {
        long startTime = System.currentTimeMillis();
        String methodName = joinPoint.getSignature().getName();
        String className = joinPoint.getTarget().getClass().getSimpleName();
        Object[] args = joinPoint.getArgs();
        
        String argsStr = args[0].toString();
        logger.debug("Cache access attempt - Method: {}.{}, Args: {}", className, methodName, argsStr);
        
        Object result = joinPoint.proceed();
        
        long executionTime = System.currentTimeMillis() - startTime;
        if (executionTime < 50) {
            logger.info("Cache HIT - Method: {}.{}, Args: {}, Time: {}ms", className, methodName, argsStr, executionTime);
        } else {
            logger.info("Cache MISS - Method: {}.{}, Args: {}, Time: {}ms", className, methodName, argsStr, executionTime);
        }
        
        return result;
    }
}
