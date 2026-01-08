import logging
import sys
from typing import Optional


def setup_logger(name: Optional[str] = None) -> logging.Logger:
    logger = logging.getLogger(name or __name__)
    
    if not logger.handlers:
        logger.setLevel(logging.INFO)
        
        handler = logging.StreamHandler(sys.stdout)
        handler.setLevel(logging.INFO)
        
        formatter = logging.Formatter(
            '%(asctime)s - %(name)s - %(levelname)s - %(message)s',
            datefmt='%Y-%m-%d %H:%M:%S'
        )
        handler.setFormatter(formatter)
        
        logger.addHandler(handler)
        logger.propagate = False
    
    return logger
