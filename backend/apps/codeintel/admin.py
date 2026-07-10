from django.contrib import admin
from .models import RepositoryMetadata
from .models import (
    CodeClass,
    CodeFunction,
    CodeImport,
    RepositoryFramework,
    RepositoryDependency,
)
 
admin.site.register(CodeClass)
admin.site.register(CodeFunction)
admin.site.register(CodeImport)
admin.site.register(RepositoryFramework)
admin.site.register(RepositoryMetadata)
admin.site.register(RepositoryDependency)