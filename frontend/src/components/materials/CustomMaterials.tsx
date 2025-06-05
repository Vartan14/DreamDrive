{/* Filters and Actions */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Пошук матеріалів..."
                  className="pl-10 bg-secondary border-gray-700"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex gap-4">
                
                {isAdmin && (
                  <Button className="bg-lider-red hover:bg-red-700">
                    <Plus size={16} className="mr-2" />
                    Створити матеріал
                  </Button>
                )}
              </div>
            </div>
            
            {/* Materials Sections */}
            <div className="space-y-6">
              {filteredSections.length > 0 ? (
                filteredSections.map(section => (
                  <Card key={section.id} className="bg-secondary border-gray-800">
                    <CardHeader 
                      className="cursor-pointer"
                      onClick={() => toggleSection(section.id)}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <CardTitle className="flex items-center text-xl">
                            <BookOpen size={20} className="mr-2 text-lider-red" />
                            {section.title}
                          </CardTitle>
                          <CardDescription className="mt-1">{section.description}</CardDescription>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <div className="text-sm text-gray-400">Materials</div>
                            <div className="font-semibold">{section.materials.length}</div>
                          </div>
                          {expandedSections.includes(section.id) ? (
                            <ChevronUp size={20} className="text-gray-400" />
                          ) : (
                            <ChevronDown size={20} className="text-gray-400" />
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    
                    {expandedSections.includes(section.id) && (
                      <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow className="border-gray-700">
                              <TableHead>Назва</TableHead>
                              <TableHead>Статус</TableHead>
                              <TableHead>Тип</TableHead>
                              <TableHead className="text-right">Дії</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {section.materials.map(material => (
                              <TableRow key={material.id} className="border-gray-700">
                                <TableCell className="font-medium">{material.title}</TableCell>
                                <TableCell>
                                  <StatusBadge status={material.status} />
                                </TableCell>
                                <TableCell>
                                  {material.premium ? (
                                    <Badge className="bg-yellow-600">Premium</Badge>
                                  ) : (
                                    <Badge className="bg-blue-600">Free</Badge>
                                  )}
                                </TableCell>
                                <TableCell className="text-right space-x-2">
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    className="text-blue-400 hover:text-blue-300"
                                  >
                                    <Eye size={16} />
                                  </Button>
                                  
                                  {isAdmin && (
                                    <>
                                      <Button 
                                        variant="ghost" 
                                        size="sm"
                                        className="text-green-400 hover:text-green-300"
                                      >
                                        <Edit size={16} />
                                      </Button>
                                      <Button 
                                        variant="ghost" 
                                        size="sm"
                                        className="text-red-400 hover:text-red-300"
                                      >
                                        <Trash2 size={16} />
                                      </Button>
                                    </>
                                  )}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                        
                        {isAdmin && (
                          <div className="mt-4 flex justify-end">
                            <Button className="bg-lider-red hover:bg-red-700">
                              <Plus size={16} className="mr-2" />
                              Додати до {section.title}
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    )}
                  </Card>
                ))
              ) : (
                <Card className="bg-secondary border-gray-800 text-center p-8">
                  <CardContent>
                    <p className="text-gray-400">Матеріалів, що відповідають критеріям пошуку, не знайдено.</p>
                  </CardContent>
                </Card>
              )}
            </div>